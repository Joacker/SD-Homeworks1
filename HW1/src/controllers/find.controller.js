const { poolGRPC } = require('../configs/database')
//const Pool = require('pg').Pool


const getItems = async (req,res) => {
    res.header("Access-Control-Allow-Origin","*");
    const response = await poolGRPC.query(`select * from items;`);
    console.log("Getting all clientes");
    res.json(response.rows);
};

module.exports = {
    getItems,
};