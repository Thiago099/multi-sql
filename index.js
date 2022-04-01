const mysql = require('mysql');

// console colors source https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4
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

async function rodaQueries()
{
  const BANCOS = process.argv.splice(3);
  
      
        //beguin transaction
        for(let banco in BANCOS){
          const CONEXAO = mysql.createConnection({...require('./config.json').database, database: BANCOS[banco]});
          await new Promise( resolve => { CONEXAO.connect((erro) => {
            if(erro){
              console.log('Não foi possível conectar ao banco de dados: ' + BANCOS[banco]);
            }
            else{
          // use database
              CONEXAO.query(process.argv[2], (erro, resultado) => {
                if(erro){
                  console.log( `${cyan}${BANCOS[banco]}${reset}: ${red}${erro}${reset}`);
                }
                else{
                  // check if it is a query
                  if(resultado.constructor.name == 'OkPacket')
                    {
                      const plural = resultado.affectedRows != 1 ? 's' : '';
                      console.log(`${cyan}${BANCOS[banco]}${reset}: ${green}Sucesso, ${resultado.affectedRows} linha${plural} afetada${plural}${reset}`);
                    }
                    else
                    {
                      console.log(BANCOS[banco])
                      console.table(resultado);
                    }
                }
                if(banco == BANCOS.length - 1){
                  process.exit(0);
                }
              })
            }
            resolve()
        })
        })
      }
}


  rodaQueries();
