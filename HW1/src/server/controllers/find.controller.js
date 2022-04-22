const { poolGRPC } = require('../configs/database')
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
    try{
        res.header("Access-Control-Allow-Origin","*");
        console.log('Fetching data ...');
        const { buscar } = req.params;
        const response = await poolGRPC.query(`select * from items where name like '%${buscar}%';`);
        const data = JSON.stringify(response.rows)
        //console.log(data)
        //response.json()
        //res.send.json(response)
        res.send(data);

        // Set to redis
        if(data != null){
            await redisclient.set(buscar, data)
        }else{
            console.log('Consulta vacia, no se guarda en cache.')
        }
        var count = 0;
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
    const { buscar } = req.params;
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