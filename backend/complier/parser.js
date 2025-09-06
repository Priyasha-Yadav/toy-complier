// Recursive-descent parser producing a simple AST for our subset.
const make = require('./make');
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos] || { type: 'EOF' };
  }

  next() {
    return this.tokens[this.pos++] || { type: 'EOF' };
  }

 // parser.js (modify expect)
expect(type) {
  const t = this.next();
  if (t.type !== type) {
    throw new Error(`Expected ${type} but got ${t.type} at line ${t.line}`);
  }
  return t;
}

  // parser.js (add to Parser class)
parse() {
  const statements = [];
  while (this.peek().type !== 'EOF') {
    if (this.peek().type === 'INT') {
      statements.push(this.parseFunction());
    } else {
      statements.push(this.parseStatement());
    }
  }
  return { type: 'Program', body: statements };
}

parseFunction() {
  this.expect('INT');
  const id = this.expect('IDENT').value;
  this.expect('LPAREN');
  const params = [];
  if (this.peek().type !== 'RPAREN') {
    params.push(this.expect('IDENT').value);
    while (this.peek().type === 'COMMA') {
      this.next();
      params.push(this.expect('IDENT').value);
    }
  }
  this.expect('RPAREN');
  this.expect('LBRACE');
  const body = [];
  while (this.peek().type !== 'RBRACE') {
    body.push(this.parseStatement());
  }
  this.expect('RBRACE');
  return make.Function(id, params, body);
}

// Add to parseStatement to handle blocks
parseStatement() {
  if (this.peek().type === 'LBRACE') {
    this.next();
    const statements = [];
    while (this.peek().type !== 'RBRACE') {
      statements.push(this.parseStatement());
    }
    this.expect('RBRACE');
    return make.Block(statements);
  }
  if (this.peek().type === 'INT') return this.parseVarDecl();
  if (this.peek().type === 'RETURN') return this.parseReturn();
  if (this.peek().type === 'IF') return this.parseIf();
  if (this.peek().type === 'WHILE') return this.parseWhile();
  if (this.peek().type === 'FOR') return this.parseFor();
  return this.parseExprStatement();
}

}


Parser.prototype.parseVarDecl = function() {
this.expect('INT');
const id = this.expect('IDENT');
this.expect('ASSIGN');
const expr = this.parseExpression();
this.expect('SEMICOLON');
return make.VarDecl(id.value, expr);
};

Parser.prototype.parseExprStatement = function() {
const expr = this.parseExpression();
this.expect('SEMICOLON');
return make.ExprStmt(expr);
};

Parser.prototype.parseReturn = function() {
this.expect('RETURN');
const expr = this.parseExpression();
this.expect('SEMICOLON');
return make.Return(expr);
};

Parser.prototype.parseIf = function() {
this.expect('IF'); this.expect('LPAREN');
const cond = this.parseExpression(); this.expect('RPAREN');
const thenB = this.parseStatement();
let elseB = null;
if (this.peek().type === 'ELSE') { this.next(); elseB = this.parseStatement(); }
return make.If(cond, thenB, elseB);
};

Parser.prototype.parseWhile = function() {
this.expect('WHILE'); this.expect('LPAREN');
const cond = this.parseExpression(); this.expect('RPAREN');
const body = this.parseStatement();
return make.While(cond, body);
};

Parser.prototype.parseFor = function() {
this.expect('FOR'); this.expect('LPAREN');
// for(init; cond; update)
let init = null;
if (this.peek().type !== 'SEMICOLON') {
if (this.peek().type === 'INT') init = this.parseVarDecl();
else init = this.parseExprStatement();
} else { this.expect('SEMICOLON'); }
const cond = this.parseExpression(); this.expect('SEMICOLON');
const update = this.parseExpression(); this.expect('RPAREN');
const body = this.parseStatement();
return make.For(init, cond, update, body);
};

// Expression parsing (precedence climbing for binary ops)
const PREC = {
'||': 1, '&&': 2,
'==': 3, '!=': 3,
'<': 4, '>': 4, '<=':4, '>=':4,
'+': 5, '-':5,
'*': 6, '/':6, '%':6
};

Parser.prototype.parseExpression = function(precedence = 0) {
let left = this.parsePrimary();
while (true) {
const t = this.peek();
const op = tokenToOp(t.type);
const pr = (op && PREC[op]) || 0;
if (pr <= precedence) break;
this.next();
const right = this.parseExpression(pr);
left = make.Binary(op, left, right);
}
return left;
};

// small helper: convert token.type -> operator string (used by parseExpression)
function tokenToOp(t) {
  const map = {
    PLUS: '+', MINUS: '-', STAR: '*', SLASH: '/', PERC: '%',
    '==': '==', '!=': '!=',
    'LT': '<', 'GT': '>',
    '<=': '<=', '>=': '>=',
    '&&': '&&', '||': '||'
  };
  return map[t] || null;
}

Parser.prototype.parsePrimary = function() {
  const t = this.peek();

  // number literal
  if (t.type === 'NUMBER') {
    this.next();
    return make.Literal(t.value);
  }

  // string literal
  if (t.type === 'STRING') {
    this.next();
    return make.StringLiteral(t.value);
  }

  // identifier: variable, assignment, or function call
  if (t.type === 'IDENT') {
    const id = this.next().value;

    // function call: IDENT '(' ... ')'
    if (this.peek().type === 'LPAREN') {
      this.next(); // consume LPAREN
      const args = [];
      if (this.peek().type !== 'RPAREN') {
        while (true) {
          args.push(this.parseExpression());
          if (this.peek().type === 'COMMA') { this.next(); continue; }
          break;
        }
      }
      this.expect('RPAREN');
      return make.Call(id, args);
    }

    // assignment: IDENT '=' expression  (note: '=' token was 'ASSIGN')
    if (this.peek().type === 'ASSIGN') {
      this.next(); // consume ASSIGN
      const expr = this.parseExpression();
      return make.Assign(id, expr);
    }

    // plain variable reference
    return make.Variable(id);
  }

  // parenthesized expression: '(' expression ')'
  if (t.type === 'LPAREN') {
    this.next(); // consume '('
    const expr = this.parseExpression();
    this.expect('RPAREN');
    return expr;
  }

  throw new Error('Unexpected token in primary: ' + t.type);
};

module.exports = Parser;