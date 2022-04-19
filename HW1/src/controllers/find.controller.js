const { poolGRPC } = require('../configs/database')
//const Pool = require('pg').Pool


const getItems = async (req,res) => {
    res.header("Access-Control-Allow-Origin","*");
    const response = await poolGRPC.query(`select * from items;`);
    console.log("Getting all clientes");
    //console.log(response.rows[0].ip);
    res.json(1);
};

module.exports = {
    getItems,
};