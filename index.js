const mysql = require('mysql');

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

async function rodaQueries() {

    const BANCOS = process.argv.splice(3);
    const QUERIES = process.argv[2].split(';');

    //beguin transaction
    for (let banco in BANCOS) {
        const CONEXAO = mysql.createConnection({
            ...require('./config.json').server,
            database: BANCOS[banco]
        });
        await new Promise(resolve => {
            CONEXAO.connect(async (erro) => {
                if (erro) {
                    console.log(`${red}Não foi possível conectar ao banco de dados: ${cyan}${BANCOS[banco]}${reset}`);
                    resolve()
                } else {
                    // use database
                    const PROMISES = []
                    for(const QUERY of QUERIES)
                    {
                      if(QUERY.trim() == '') continue;
                      PROMISES.push(new Promise(resolve => {
                          CONEXAO.query(QUERY, (erro, resultado) => {
                              if (erro) {
                                  console.log(`${cyan}${BANCOS[banco]}${reset}: ${yellow}in "${QUERY}" ${red}${erro}${reset}`);
                              } else {
                                  // check if it is a query
                                  if (resultado.constructor.name == 'OkPacket') {
                                      const plural = resultado.affectedRows != 1 ? 's' : '';
                                      console.log(`${cyan}${BANCOS[banco]}${reset}: ${green}Sucesso, ${resultado.affectedRows} linha${plural} afetada${plural}${reset}`);
                                  } else {
                                      console.log(`${cyan}${BANCOS[banco]}${reset}: ${green}Sucesso, ${resultado.length} linhas retornadas${reset}`);
                                      console.table(resultado);
                                  }
                              }
                              
                              resolve();
                          })
                      }))
                    }
                    await Promise.all(PROMISES)
                    
                }
                resolve()
            })
        })
        if (banco == BANCOS.length - 1) {
          process.exit(0);
        }
    }
}
rodaQueries();
