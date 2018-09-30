import * as MongoDB from 'mongodb';

import Collection from './Collection';

export default class CollectionFactory {
    client: MongoDB.MongoClient;
    db: MongoDB.Db;

    async connect(uri: string, dbName: string) {
        this.client = await MongoDB.MongoClient.connect(uri, { useNewUrlParser: true });
        this.db = this.client.db(dbName);
    }

    close() {
        return this.client.close();
    }

    createCollection<T>(collectionName: string) {
        return new Collection<T>(this.db.collection(collectionName));
    }
}