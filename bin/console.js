const { Transform } = require('stream');
const { Console } = require('console');

module.exports.table = (input) =>
{
    // https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    }
    console.log(result);
}

module.exports.reset = "\x1b[0m"
module.exports.bright = "\x1b[1m"
module.exports.dim = "\x1b[2m"
module.exports.underscore = "\x1b[4m"
module.exports.blink = "\x1b[5m"
module.exports.reverse = "\x1b[7m"
module.exports.hidden = "\x1b[8m"

module.exports.black = "\x1b[30m"
module.exports.red = "\x1b[31m"
module.exports.green = "\x1b[32m"
module.exports.yellow = "\x1b[33m"
module.exports.blue = "\x1b[34m"
module.exports.magenta = "\x1b[35m"
module.exports.cyan = "\x1b[36m"
module.exports.white = "\x1b[37m"
