// make.js
module.exports = {
  VarDecl(id, value) {
    return { type: 'VarDecl', id, value };
  },
  ExprStmt(expr) {
    return { type: 'ExprStmt', expr };
  },
  Return(expr) {
    return { type: 'Return', expr };
  },
  If(cond, then, elseBranch) {
    return { type: 'If', cond, then, else: elseBranch };
  },
  While(cond, body) {
    return { type: 'While', cond, body };
  },
  For(init, cond, update, body) {
    return { type: 'For', init, cond, update, body };
  },
  Block(statements) {
    return { type: 'Block', statements };
  },
  Literal(value) {
    return { type: 'Literal', value };
  },
  StringLiteral(value) {
    return { type: 'StringLiteral', value };
  },
  Variable(id) {
    return { type: 'Variable', id };
  },
  Assign(id, expr) {
    return { type: 'Assign', id, expr };
  },
  Binary(op, left, right) {
    return { type: 'Binary', op, left, right };
  },
  Call(callee, args) {
    return { type: 'Call', callee, args };
  },

Function(id, params, body) {
  return { type: 'Function', id, params, body };
}
};