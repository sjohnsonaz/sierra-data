import * as MongoDB from 'mongodb';

import Collection from './Collection';
import { IData } from '../interfaces/IData';
import Model from './Model';

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

    createCollection<T extends IData>(collectionName: string, modelConstructor: new (data: T) => Model<T>) {
        return new Collection<T>(this.db.collection(collectionName), modelConstructor);
    }
}