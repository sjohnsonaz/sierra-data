import Sierra, { BodyMiddleware } from 'sierra';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { CollectionFactory } from '../src/SierraData';

import PostService from './PostService';
import PostCollection from './PostCollection';

(async () => {
    let mongoServer = new MongoMemoryServer();
    let mongoUri = await mongoServer.getUri();

    let collectionFactory = new CollectionFactory();
    await collectionFactory.connect(mongoUri, 'sierra-data');

    let application = new Sierra();
    application.use(BodyMiddleware.handle);

    let postCollection = new PostCollection(collectionFactory);
    let postService = new PostService(postCollection);
    application.addController(postService);

    let port = 3000;
    try {
        await application.init();
        await application.listen(port);
        console.log('Started on port', port);
    }
    catch (e) {
        console.error(e);
    }
})();
//await mongoServer.stop();
//await collectionFactory.close();