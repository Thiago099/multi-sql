#!/usr/bin/env node
const mysql = require('mysql');
const fs = require('fs');
const { config } = require('process');

const readFile = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const { Transform } = require('stream');
const { Console } = require('console');

function table(input) {
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

const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"

const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const white = "\x1b[37m"

async function main() {

    const config = require('./config.json');

    // check if there is a preset argument
    if(Object.keys(config).includes(process.argv[2]))
    {
      DATABASES = process.argv.splice(4)
      queries = process.argv[3]
      query_config = config[process.argv[2]]
    }
    else
    {
      DATABASES = process.argv.splice(3);
      queries = process.argv[2]
      query_config = config.localhost
    }

    // check if queries is a file
    if (queries.trim().endsWith('.sql')) {
      queries = await readFile(queries);
    }
    

    queries = queries.split(';');
    


    //beguin transaction
    for (const DATABASE in DATABASES) {
        const CONNECTION = mysql.createConnection({
            ...query_config,
            database: DATABASES[DATABASE]
        });
        await new Promise(resolve => {
            CONNECTION.connect(async (erro) => {
                if (erro) {
                    // connection error message
                    console.log(`${cyan}${DATABASES[DATABASE]}:${red} Failed to connect to database.${reset}`);
                    resolve()
                } else {
                    // disable foreign keys for async query
                    await new Promise(resolve => CONNECTION.query('SET foreign_key_checks = 0', () => {resolve()}))
                    const PROMISES = []
                    for(const QUERY of queries)
                    {
                      if(QUERY.trim() == '') continue;
                      PROMISES.push(new Promise(resolve => {
                          CONNECTION.query(QUERY, (erro, result) => {
                              if (erro) {
                                  // query error message
                                  console.log(`${cyan}${DATABASES[DATABASE]}${reset}:\n${yellow}${QUERY}\n${red}${erro}.${reset}\n`);
                              } else {
                                  if (result.constructor.name == 'OkPacket') {
                                      resolve(result.affectedRows)
                                  } else {
                                      // query result message
                                      console.log(`${cyan}${DATABASES[DATABASE]}${reset}: ${green}Success, ${result.length} row${result.length == 1?'':'s'} found.${reset}`);
                                      if(result.length > 0) table(result);
                                  }
                              }
                              
                              resolve(-1);
                          })
                      }))
                    }
                    var affected = await Promise.all(PROMISES)
                    affected = affected.filter(item => item != -1)
                    if(affected.length > 0)
                    {
                        // query success message
                        const ROWS = affected.reduce((a,b) => a + b, 0)
                        console.log(`${cyan}${DATABASES[DATABASE]}${reset}: ${green}Success, ${ROWS} row${ROWS == 1 ? '' : 's'} affected.${reset}`);
                    }
                    
                }
                resolve()
            })
        })
        if (DATABASE == DATABASES.length - 1) {
          process.exit(0);
        }
    }
}
main();
