/* IMPORT */

const Pool = require('pg').Pool


/* ENVS */

const poolGRPC = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'SD1',
    port: '5432',
});



module.exports = {
    poolGRPC,
};