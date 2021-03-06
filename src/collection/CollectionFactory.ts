import * as MongoDB from 'mongodb';

export default class CollectionFactory {
    client: MongoDB.MongoClient;
    db: MongoDB.Db;
    collections: {
        [index: string]: MongoDB.Collection;
    } = {};

    async connect(uri: string, dbName: string) {
        this.client = await MongoDB.MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = this.client.db(dbName);
    }

    close() {
        this.collections = {};
        return this.client.close();
    }

    getCollection(collectionName: string) {
        if (!this.collections[collectionName]) {
            this.collections[collectionName] = this.db.collection(collectionName);
        }
        return this.collections[collectionName];
    }
}