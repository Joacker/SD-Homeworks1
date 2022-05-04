const { poolGRPC } = require('../configs/database')
const grpc = require('../../client/client_search')
//const Pool = require('pg').Pool


const getItems = async (req,res) => {
    console.log("IN");
    const item = req.query.name;
    console.log("item entregado: ",item);
    if (item) {
        console.log('Primer IF');
        grpc.GetItem({name: item}, (error, items) => {
        if (error){
            //console.log(error);
            res.json({});
        } res.json(items);
        })
    }else{
        console.log('Segundo IF');
        const item = null;
        grpc.GetItem({name: item}, (error, items) => {
        if (error){
            //console.log(error);
            res.json({});
        }
        res.json(items);
    })
    }
};


module.exports = {
    getItems,
}