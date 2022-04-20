const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH =  __dirname + "../configs/example.proto";

const items = require('./data.json');

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
  const search = grpc.search;
  const server = () => {
    const server = new grpc.Server();
    server.addService(itemProto.ItemService.service, {
      getItem: (_, callback) => {
        const itemName = _.request.name;
        const item = items.item_list.filter((obj) => obj.name.includes(itemName));
        callback(null, { items: item});
      }
    });
    server.bindAsync("0.0.0.0:8050", grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err != null) console.log(err);
      else {
        console.log("GRPC SERVER RUN AT http://localhost:8050");
        server.start();
      }
    });
  };
  
  modules.exports = server;