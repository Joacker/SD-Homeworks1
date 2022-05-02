const express = require("express");
const cors = require("cors");
const grpc = require('./client/client_search')
const server = require('./server/server_search')
server.server();

const port = 8050;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/items", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});