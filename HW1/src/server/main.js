/* IMPORTS */
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const redis = require('redis');
const axios = require('axios');
//-------------------------------------------

/* CONFIGS */
const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors())

/* VARIABLES */
// 8070 8000
var port = process.env.PORT || 8000;

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

app.use(require('./api/find'));



/* PORTS */

app.listen(port,()=>{
    console.log(`Servidor de grpc-app corriendo en: http://localhost:${port}.`)
});