#!/usr/bin/env node
const mysql = require('mysql');

const { read_file } = require('./bin/io.js');

const 
{
    table,

    reset, bright, dim, underscore, blink, reverse, hidden,

    black, red, green, yellow, blue, magenta, cyan, white

} = require('./bin/console.js');

async function process_arguments()
{
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
      queries = await read_file(queries);
    }

    queries = queries.split(';');
    
    return {QUERIES:queries, QUERIES_CONFIG:query_config, DATABASES}
}

async function main() {

    const { QUERIES, QUERIES_CONFIG, DATABASES } = await process_arguments()

    //beguin transaction
    for (const DATABASE of DATABASES) {
        const CONNECTION = mysql.createConnection({
            ...QUERIES_CONFIG,
            database: DATABASE
        });
        await new Promise(resolve => {
            CONNECTION.connect(async (erro) => {
                if (erro) {
                    // connection error message
                    console.log(`${cyan}${DATABASE}:${red} Failed to connect to database.${reset}`);
                    resolve()
                } else {
                    // disable foreign keys for async query
                    await new Promise(resolve => CONNECTION.query('SET foreign_key_checks = 0', () => {resolve()}))
                    const PROMISES = []
                    for(const QUERY of QUERIES)
                    {
                      if(QUERY.trim() == '') continue;
                      PROMISES.push(new Promise(resolve => {
                          CONNECTION.query(QUERY, (erro, result) => {
                              if (erro) {
                                  // query error message
                                  console.log(`${cyan}${DATABASE}${reset}:\n${yellow}${QUERY}\n${red}${erro}.${reset}\n`);
                              } else {
                                  if (result.constructor.name == 'OkPacket') {
                                      resolve(result.affectedRows)
                                  } else {
                                      // query result message
                                      console.log(`${cyan}${DATABASE}${reset}: ${green}Success, ${result.length} row${result.length == 1?'':'s'} found.${reset}`);
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
                        console.log(`${cyan}${DATABASE}${reset}: ${green}Success, ${ROWS} row${ROWS == 1 ? '' : 's'} affected.${reset}`);
                    }
                    
                }
                resolve()
            })
        })
    }
    process.exit(0);    
}
main();
