const express = require('express');
const bodyParser = require('body-parser');
const { VM } = require('vm2');
const compiler = require('./complier'); // index exports compile->js code
const cors = require('cors');
require('dotenv').config();


const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
];

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

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
  })
);


app.post('/api/check', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length > 10000) {
    return res.status(400).json({ ok: false, error: 'Invalid or too large input code' });
  }
  try {
    compiler.compileToJS(code);
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// server.js (add input validation)
app.post('/api/compile', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length > 10000) {
    return res.status(400).json({ ok: false, error: 'Invalid or too large input code' });
  }
  try {
    const js = compiler.compileToJS(code);
    res.json({ ok: true, js });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// Stricter VM

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



// (Stub) Save as gist endpoint — you'll need to implement OAuth/GitHub tokens
app.post('/api/save', (req, res) => {
// req.body: { filename, content, token }
res.status(501).json({ ok: false, error: 'Not implemented. Add GitHub OAuth flow and use /gists API.' });
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));