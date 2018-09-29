import * as MongoDB from 'mongodb';

import Model from './Model';

export default class Collection<T> {
    client: MongoDB.MongoClient;
    db: MongoDB.Db;

    async connect(uri: string, dbName: string) {
        this.client = await MongoDB.MongoClient.connect(uri);
        this.db = this.client.db(dbName);
    }

    async create(model: Model<T>) {
        let result = await this.db.collection('testcollection').insertOne(model.unwrap());
        model.update();
        return result;
    }

    async findOne(query: Partial<T>) {
        let result = await this.db.collection('testcollection').findOne<T>(query);
    }

    async update(model: Model<T>) {
        let result = this.db.collection('testcollection').updateOne({ _id: model._id }, { $set: model.diff() });
        model.update();
        return result;
    }
}