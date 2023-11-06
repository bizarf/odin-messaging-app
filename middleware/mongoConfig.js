const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoDb = process.env.MONGODB_KEY;

let mongoServer;

const connectToDatabase = async () => {
    if (process.env.NODE_ENV === "test") {
        if (!mongoServer) {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
        } else {
            await mongoose.connect(mongoDb);
        }
    }
};

const disconnectDatabase = async () => {
    await mongoose.disconnect();
    if (process.env.NODE_ENV === "test") {
        await mongoServer.stop();
    }
};

module.exports = {
    connectToDatabase,
    disconnectDatabase,
};
