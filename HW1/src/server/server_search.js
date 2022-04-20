const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH ="./search.proto";

const items = require('../data.json');

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition).items;

const server = () => {
    const server = new grpc.Server();
    server.addService(itemProto.Items.service, {
        getItems: (call, callback) => {
            const itemName = call.request.name;
            const item = items.item_list.filter((obj) => obj.name.includes(itemName));
            callback(null, { items });
        },
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