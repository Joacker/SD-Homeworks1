const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH =  "./src/server/search.proto";
const { poolGRPC } = require('./configs/database')
const dotenv = require('dotenv')
dotenv.config();
//console.log(items)
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
  const itemProto = grpc.loadPackageDefinition(packageDefinition);
  //console.log(PROTO_PATH)
  var items = []

  const server = () => {

    const server = new grpc.Server();
    server.addService(itemProto.ItemService.service, {
      getItem: (_, callback) => {
        const itemName = _.request.name;
        //console.log(itemName)

        if(itemName){
          poolGRPC.query(`select * from Items `, (err, res) => {
          //poolGRPC.query('select * from Items;', (err, res) => {
          items = res.rows
          if (err) {
            console.log(err.stack);
            //callback(err, null);
          }else{
            console.log(items)
            //callback(null, { items: items});
          }
          const item = items.filter((obj) => obj.name.includes(itemName));
          callback(null, { items: item});
        })
        }else console.log("All Data Call");
         poolGRPC.query('select * from Items;', (err, res) => {
          items = res.rows
          if (err) {
            console.log(err.stack);
            //callback(err, null);
          }else{
            console.log(items)
            //callback(null, { items: items});
          }
          const item = items.filter((obj) => obj.name.includes(itemName));
          callback(null, { items: item});
        })
      }
    });
    server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err != null) console.log(err);
      else {
        console.log("GRPC SERVER RUN AT http://localhost:50051");
        server.start();
      }
    });
  };
  
  exports.server = server;