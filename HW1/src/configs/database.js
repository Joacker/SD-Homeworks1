/* IMPORT */

const Pool = require('pg').Pool


/* ENVS */

const poolGRPC = new Pool ({
    host: process.env.HOST_GRPC,
    user: process.env.USER_GRPC,
    password: process.env.PASS_GRPC,
    database: process.env.DATABASE_GRPC,
    port: process.env.PORT_GRPC,
});



module.exports = {
    poolGRPC,
};