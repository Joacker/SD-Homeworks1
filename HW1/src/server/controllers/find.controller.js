const { poolGRPC } = require('../configs/database')
const axios = require('axios')
const https = require('https')
//const Pool = require('pg').Pool


const getItems = async (req,res) => {
    res.header("Access-Control-Allow-Origin","*");
    const { name } = req.body;
    const SQLquery = `select * from items where name like '%' || $1 || '%';`;
    const find = [name];
    const response = await poolGRPC.query(SQLquery,find)
    console.log("Getting all items");
    res.json(response.rows);
};

const getRedis = async (req, res, next) => {
    // si no esta en cache
    try{
        res.header("Access-Control-Allow-Origin","*");
        console.log('Fetching data ...');
        
        const { buscar } =req.query.q;
    
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
        for await (const key of redisclient.scanIterator()) {
            // use the key!
            count ++;
            console.log(key+' '+await redisclient.get(key));
          }
          console.log(count);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
};

// Cache middleware

async function cache (req, res, next) {
    const { buscar } = req.query.q;
    var data = await redisclient.get(buscar)
        if(data != null){
            console.log('De cache')
            res.send(data);
        } else {
            next();
        }
}


module.exports = {
    getItems,
    getRedis,
    cache,
};