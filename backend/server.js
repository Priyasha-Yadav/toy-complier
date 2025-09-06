const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');
const { VM } = require('vm2');
const compiler = require('./complier'); // your compileToJS function
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '1mb' }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// ---------------- Passport GitHub ----------------
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { profile, token: accessToken };
      return done(null, user);
    }
  )
);

app.get('/auth/github', passport.authenticate('github', { scope: ['gist'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/?auth=success');
  }
);

app.get('/api/me', (req, res) => {
  if (!req.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.user.profile });
});

// ---------------- Compiler Endpoints ----------------

// Syntax check
app.post('/api/check', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length > 10000) {
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid or too large input code' });
  }
  try {
    compiler.compileToJS(code);
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// Compile only
app.post('/api/compile', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length > 10000) {
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid or too large input code' });
  }
  try {
    const js = compiler.compileToJS(code);
    res.json({ ok: true, js });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// Run compiled code
app.post('/api/run', async (req, res) => {
  const { code } = req.body;
  const stdout = [];
  try {
    const js = compiler.compileToJS(code);
    const vm = new VM({
      timeout: 2000,
      sandbox: {
        console: { log: (...args) => stdout.push(args.join(' ')) },
      },
    });
    vm.run(js + '\nmain();'); // Append main() call
    res.json({ ok: true, output: stdout.join('\n') });
  } catch (err) {
    res.json({ ok: false, error: err.message, output: stdout.join('\n') });
  }
});

// ---------------- Save as Gist ----------------
app.post('/api/save', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ ok: false, error: 'Not logged in' });
  }
  const { filename, content } = req.body;
  try {
    const r = await axios.post(
      'https://api.github.com/gists',
      {
        files: { [filename]: { content } },
        description: 'Saved from C compiler IDE',
        public: false,
      },
      { headers: { Authorization: `token ${req.user.token}` } }
    );
    res.json({ ok: true, gist: r.data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---------------- Server ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
