const mysql = require('mysql');

async function rodaQueries()
{
  const BANCOS = process.argv.splice(3);
  const CONEXAO = mysql.createConnection(require('./config.json').database)
      CONEXAO.connect((erro) => {
      if(erro){
        console.log('Não foi possível conectar');
      }
      else{
        //beguin transaction
        for(let banco in BANCOS){

          // use database
          CONEXAO.query(`USE ${BANCOS[banco]}`, (erro) => {
            if(erro){
              console.log(`Não foi possível conectar ao banco ${banco}`);
            }
            else
            {
              CONEXAO.query(process.argv[2], (erro, resultado) => {
                if(erro){
                  console.log(banco + ': '+erro);
                }
                else{
                  // check if it is a query
                  if(resultado.constructor.name == 'OkPacket')
                    {
                      console.log(banco + ': sucesso, '+resultado.affectedRows + ' linhas afetadas');
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
          })
        }
      }
    })
  }

  rodaQueries();