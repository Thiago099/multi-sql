const mysql = require('mysql');
const fs = require('fs');

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

    const DATABASES = process.argv.splice(3);
    var queries = process.argv[2]
    // check if queries is a file
    if (queries.trim().endsWith('.sql')) {
        queries = await readFile(queries);
    }

    queries = queries.split(';');
    


    //beguin transaction
    for (const DATABASE in DATABASES) {
        const CONEXAO = mysql.createConnection({
            ...require('./config.json').server,
            database: DATABASES[DATABASE]
        });
        await new Promise(resolve => {
            CONEXAO.connect(async (erro) => {
                if (erro) {
                    console.log(`${red}Failed to connect to database: ${cyan}${DATABASES[DATABASE]}${reset}`);
                    resolve()
                } else {
                    // use database
                    const PROMISES = []
                    for(const QUERY of queries)
                    {
                      if(QUERY.trim() == '') continue;
                      PROMISES.push(new Promise(resolve => {
                          CONEXAO.query(QUERY, (erro, result) => {
                              if (erro) {
                                  console.log(`${cyan}${DATABASES[DATABASE]}${reset}:\n${yellow}${QUERY}\n${red}${erro}${reset}\n`);
                              } else {
                                  if (result.constructor.name == 'OkPacket') {
                                      resolve(result.affectedRows)
                                  } else {
                                      console.log(`${cyan}${DATABASES[DATABASE]}${reset}: ${green}Success, ${result.length} row${result.length == 1?'':'s'} found${reset}`);
                                      console.table(result);
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
                      const ROWS = affected.reduce((a,b) => a + b, 0)
                      console.log(`${cyan}${DATABASES[DATABASE]}${reset}: ${green}Success, ${ROWS} row${ROWS == 1 ? '' : 's'} affected${reset}`);
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
