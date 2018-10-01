import * as MongoDB from 'mongodb';

import Collection from './Collection';
import { IData } from '../interfaces/IData';
import Model from './Model';

export default class CollectionFactory {
    client: MongoDB.MongoClient;
    db: MongoDB.Db;
    collections: {
        [index:string]: MongoDB.Collection;
    } = {};

    async connect(uri: string, dbName: string) {
        this.client = await MongoDB.MongoClient.connect(uri, { useNewUrlParser: true });
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