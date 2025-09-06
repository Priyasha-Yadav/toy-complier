const KEYWORDS = new Set(['int', 'return', 'if', 'else', 'while', 'for']);

function isSpace(ch) { return /\s/.test(ch); }
function isDigit(ch) { return /[0-9]/.test(ch); }
function isAlpha(ch) { return /[a-zA-Z_]/.test(ch); }

function tokenize(input) {
  let i = 0;
  let line = 1;
  const tokens = [];
  while (i < input.length) {
    const ch = input[i];
    if (ch === '\n') { line++; i++; continue; }
    if (isSpace(ch)) { i++; continue; }
    // Skip preprocessor directives (lines starting with #)
    if (ch === '#') {
      while (i < input.length && input[i] !== '\n') { i++; }
      line++;
      continue;
    }
    if (isDigit(ch)) {
      let num = ch; i++;
      while (i < input.length && isDigit(input[i])) { num += input[i++]; }
      tokens.push({ type: 'NUMBER', value: parseInt(num, 10), line });
      continue;
    }
    if (isAlpha(ch)) {
      let id = ch; i++;
      while (i < input.length && (isAlpha(input[i]) || isDigit(input[i]))) id += input[i++];
      if (KEYWORDS.has(id)) tokens.push({ type: id.toUpperCase(), line });
      else tokens.push({ type: 'IDENT', value: id, line });
      continue;
    }
    if (ch === '"') {
      i++; let s = '';
      while (i < input.length && input[i] !== '"') {
        if (input[i] === '\n') line++;
        s += input[i++];
      }
      i++; tokens.push({ type: 'STRING', value: s, line });
      continue;
    }
    const two = input.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(two)) {
      tokens.push({ type: two, line });
      i += 2;
      continue;
    }
    const singleMap = {
      '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH', '%': 'PERC',
      '=': 'ASSIGN', ';': 'SEMICOLON', ',': 'COMMA', '(': 'LPAREN', ')': 'RPAREN',
      '{': 'LBRACE', '}': 'RBRACE', '<': 'LT', '>': 'GT',
    };
    if (singleMap[ch]) {
      tokens.push({ type: singleMap[ch], line });
      i++;
      continue;
    }
    throw new Error(`Unknown char: ${ch} at line ${line}`);
  }
  tokens.push({ type: 'EOF', line });
  return tokens;
}

module.exports = { tokenize };