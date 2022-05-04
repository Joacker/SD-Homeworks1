const express = require("express");
const cors = require("cors");
const grpc = require('./client/client_search')
const server = require('./server/server_search')
//const { Pool } = require('pg')
// Este script se uso en función de lo visto en ayudantía
server.server();

var port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/items", async (req, res) => {
  const product = req.query.name;
  console.log("item entregado: ",product);
  if (product) {
    grpc.GetItem({
        name: product
      }, 
      (error, items) => {
      if (error){
          console.log("error");
          res.json({});
      } res.json(items);
    })
  }else{
    const product = null;
    grpc.GetItem({
      name: product
    }, 
    (error, items) => {
      if (error){
          console.log("error");
          res.json({});
      }
      res.json(items);
  })
  }
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});