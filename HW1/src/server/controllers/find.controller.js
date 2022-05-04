const { poolGRPC } = require('../configs/database')
const axios = require('axios')
const https = require('https')
//const Pool = require('pg').Pool


const getItems = async (req,res) => {
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
};

const getRedis = async (req, res, next) => {
    console.log('Entro al Servidor');
    const item = req.query.q;
    console.log('item Enviado: ',item)
    let cache = null;
    (async () => {
      let reply = await redisclient.get(item);
        if(reply)
        {
          console.log('Esta en Cache');          
          cache = JSON.parse(reply)
          res.json(cache);
          //contador de consultas en cache
        }else{
          console.log('No esta en Cache');
  
          axios.get('http://g_rpc:5000/items', 
          {
               params:{
                   name: item
                }
            }).then( json => {
            
            let data = JSON.stringify(json.data)
            redisclient.set(item, data);
            cache = json.data;
            console.log("hola")
            res.json(cache);
          }).catch(error => {console.error(error)})
          
        }
        console.log(await redisclient.keys("*"));
    })();
};

module.exports = {
    getItems,
    getRedis,
};