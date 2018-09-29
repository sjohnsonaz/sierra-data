import * as MongoDB from 'mongodb';

import Model from './Model';

export default class Collection<T> {
    collection: MongoDB.Collection;

    constructor(collection: MongoDB.Collection) {
        this.collection = collection;
    }

    async create(model: Model<T>) {
        let result = await this.collection.insertOne(model.unwrap());
        model._id = result.insertedId;
        model.update();
        return result;
    }

    async update(model: Model<T>) {
        let result = this.collection.updateOne({ _id: model._id }, { $set: model.diff() });
        model.update();
        return result;
    }

    async findOne(query: Partial<T>, modelConstructor: new (data: T) => Model<T>) {
        let result = await this.collection.findOne<T>(query);
        return new modelConstructor(result);
    }
}