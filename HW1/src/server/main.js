/* IMPORTS */
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const redis = require('redis');
const axios = require('axios');
//-------------------------------------------

/* CONFIGS */
//server.server();
const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors())

/* VARIABLES */

var port = process.env.PORT || 8070;
const redisclient = redis.createClient({
    url: process.env.REDIS_URL
});
console.log('waiting for redis start...')
redisclient.on('ready', function () {
    console.log('redis is ready',process.env.REDIS_URL)
});
redisclient.connect();

console.log('Redis conection: '+redisclient.isOpen);
global.redisclient = redisclient;

app.get("/items", async (req, res) => {
    const item = req.query.name;
    if (item) {
        console.log('Existe Item');
      grpc.GetItem({name: item}, (error, items) => {
          if (error){
              //console.log(error);
              res.json({});
          } res.json(items);
      })
    }
  });


  app.get('/search', (req, res) => {
    console.log('Entro al Servidor');
    const item = req.query.q;
    console.log('item Enviado: ',item)
    let cache = null;
    (async () => {
      let reply = await redisclient.get(item);
      console.log('Cache?: ',reply); // ReactJS
        if(reply)
        {
          console.log('Esta en Cache');
          console.log("asdasdsdadasd")
          
          cache = JSON.parse(reply)
          res.json(cache);
          //contador de consultas en cache
        }else{
          console.log('No esta en Cache');
          axios.get('http://g_rpc:8050/items', 
          {
               params:{
                   name: item
                }
            }).then( res2 => {
            //console.log(`statusCode: ${res.status}`)
            //console.log('Data:',res2.data);
            
            let data = JSON.stringify(res2.data)
            redisclient.set(item, data);
            cache = res2.data;
            console.log("hola")
            res.json(cache);
          }).catch(error => {console.error(error)})
          
        }
        console.log(await redisclient.keys("*"));
        /*
        var count = 0;
        for await (const key of redisclient.scanIterator()) {
            // use the key!
            count ++;
            console.log(count +" "+ key);
            }
            */
    })();
  });
  /*app.get( "/search",async (req, res, next) => {
    const { buscar } = req.query.q;

    var data = await redisclient.get(buscar)
    if(data != null){
        console.log('De cache')
        res.send(data);
    } else {
        try{
            console.log('Fetching data ...');
            
            const { buscar } = req.query.q;
        
            // Set to redis
            (async() => {
                axios.get('http://gr_rpc:50051/items',
                {
                    params: {name: buscar}
                    
                }).then(res2 => {
                    console.log('Data:',res2.data);
                    let data = JSON.stringify(res2.data)
                    let min_cache;
                    if(data != null){
                        redisclient.set(buscar, data)
                        min_cache = res2.data
                        res.json(min_cache)
                    }else{
                        console.log('Consulta vacia, no se guarda en cache.')
                    }
                })
            })();
            var count = 0;
            //contador de consultas en cache
            /*for await (const key of redisclient.scanIterator()) {
                // use the key!
                count ++;
                console.log(key+' '+await redisclient.get(key));
                }
                console.log(count);
        } catch (err) {
            console.error(err);
            res.status(500);
        }
    }
// si no esta en cache
    
});*/

// Cache middleware

/*async function cache (req, res, next) {
    const { buscar } = req.query.q;
    var data = await redisclient.get(buscar)
        if(data != null){
            console.log('De cache')
            res.send(data);
        } else {
            next();
        }
}*/


//app.use('/api/items', require('../GRPC/server/api/find'));
//app.use('/api/items', require('./api/find'));




/* PORTS */

app.listen(port,()=>{
    console.log(`Servidor de grpc-app corriendo en: http://localhost:${port}.`)
});