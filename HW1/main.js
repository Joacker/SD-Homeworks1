/* IMPORTS */
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const grpc_cli = require('./src/client/client_search')
const server = require('./src/server/server_search')
//-------------------------------------------

/* CONFIGS */

server.server();
const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors())

/* VARIABLES */

var port = process.env.PORT || 4000
var ip = process.env.PORT || 'localhost'

//app.get('/', (req,res) => res.send('<h1>app Operando</h1>'))
app.get("/items", async (req, res) => {
    const item = req.query.name;
    if (item) {
      grpc.GetItem({name: item}, (error, items) => {
          if (error){
              console.log(error);
              res.json({});
          } res.json(items);
      })
    }
  });
app.use('/api/items', require('./src/api/find'));

/* PORTS */

app.listen(port,()=>{
    console.log(`Servidor de grpc-app corriendo en: http://${ip}:${port}.`)
});