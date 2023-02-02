const { MongoClient } = require('mongodb');
const fs = require('fs');

// Store client in module scope
let mongoClient = null;
let isConnected = false;

async function getMongoClient() {
    let mongoURI = process.env.MONGO_URI;

    // If mongo client is not available, create a new one
    if (mongoClient === null) {
        // If server is running in local environment
        if (process.env.NODE_ENV === 'development') {
            const confFile = fs.readFileSync('.mongo.conf');
            const { uri } = JSON.parse(confFile);
            console.log("Using MongoMemoryServer", uri)
            mongoURI = uri;
        }
        mongoClient = new MongoClient(mongoURI);
    }

    // If client is not connected
    if (!isConnected) {
        console.log("Connecting to MongoDB Server");
        await mongoClient.connect();
        isConnected = true;
        console.log("Connected to MongoDB Server");
    }

    const db = mongoClient.db("locations");
    const collection = db.collection('documents');
    return {
        client: mongoClient, collection
    }
}

module.exports = { getMongoClient };
