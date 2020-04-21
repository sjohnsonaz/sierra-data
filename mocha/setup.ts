import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
before(async function () {
    mongoServer = new MongoMemoryServer();
    global['mongoUri'] = await mongoServer.getUri();
});

after(async function () {
    await mongoServer.stop();
});