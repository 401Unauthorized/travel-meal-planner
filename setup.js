const fs = require('fs');
const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
    console.log("Starting MongoDB Server...");
    const mongoServer = await MongoMemoryServer.create().catch(error => console.log(error));
    console.log("Started MongoDB Server", mongoServer.getUri());

    let data = JSON.stringify({
        uri: mongoServer.getUri()
    });
    fs.writeFileSync('.mongo.conf', data);

    process.on('SIGINT', function () {
        process.exit();
    });

    process.on('exit', () => {
        console.log("Shutting Down MongoDB Server");
        mongoServer.stop();
    });
})();

