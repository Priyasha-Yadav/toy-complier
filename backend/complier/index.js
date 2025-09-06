// index.js
const lexer = require('./lexer');
const parser = require('./parser');
const codegen = require('./codegen');

function compileToJS(source) {
  const tokens = lexer.tokenize(source);
  const parserInstance = new parser(tokens); // Instantiate Parser
  const ast = parserInstance.parse(); // Call parse on the instance
  const js = codegen.genProgram(ast); // Use genProgram from codegen
  return js;
}

module.exports = { compileToJS };