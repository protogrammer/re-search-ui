const { readFileSync } = require('fs');

try {
  const [regexText, flags, file = null] = process.argv.slice(2);
  const regex = RegExp(regexText, flags);
  process.send({
    state: 'ok',
    matches:
      file == null
        ? null
        : Array.from(readFileSync(file).toString().matchAll(regex)).map(
            (match) => [match.index, match.index + match[0].length],
          ),
  });
} catch (e) {
  process.send({
    state: e instanceof SyntaxError ? 'error' : 'internal-error',
    message: e.message,
  });
}
