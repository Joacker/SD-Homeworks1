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

module.exports = {
    getItems,
};