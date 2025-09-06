// backend/complier/codegen.js

function genProgram(ast) {
  return ast.body.map(genStmt).join('\n');
}

// codegen.js (update genStmt)
function genStmt(node) {
  switch (node.type) {
    case 'VarDecl':
      return `let ${node.id} = ${genExpr(node.value)};`;
    case 'ExprStmt':
      return genExpr(node.expr) + ';';
    case 'Return':
      return `return ${genExpr(node.expr)};`;
    case 'If':
      return `if (${genExpr(node.cond)}) { ${genStmt(node.then)} }` +
        (node.else ? ` else { ${genStmt(node.else)} }` : '');
    case 'While':
      return `while (${genExpr(node.cond)}) { ${genStmt(node.body)} }`;
    case 'For':
      return `for (${node.init ? genStmt(node.init) : ''} ${genExpr(node.cond)}; ${genExpr(node.update)}) { ${genStmt(node.body)} }`;
    case 'Block':
      return '{ ' + node.statements.map(genStmt).join(' ') + ' }';
    case 'Function':
      return `function ${node.id}(${node.params.join(', ')}) { ${node.body.map(genStmt).join('\n')} }`;
    default:
      throw new Error(`Unknown stmt type: ${node.type}`);
  }
}

function genProgram(ast) {
  const code = ast.body.map(genStmt).join('\n');
  const hasMain = ast.body.some(node => node.type === 'Function' && node.id === 'main');
  return hasMain ? `${code}\nmain();` : code;
}

function genExpr(node) {
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'StringLiteral':
      return JSON.stringify(node.value);
    case 'Variable':
      return node.id;
    case 'Assign':
      return `${node.id} = ${genExpr(node.expr)}`;
    case 'Binary':
      return `(${genExpr(node.left)} ${node.op} ${genExpr(node.right)})`;
    case 'Call':
      if (node.callee === 'printf') {
        // crude translation: printf("%d", x) -> console.log(x)
        return 'console.log(' + node.args.map(genExpr).join(', ') + ')';
      }
      return `${node.callee}(${node.args.map(genExpr).join(', ')})`;
    default:
      throw new Error(`Unknown expr type: ${node.type}`);
  }
}

module.exports = { genProgram };
