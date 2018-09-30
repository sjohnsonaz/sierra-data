import * as MongoDB from 'mongodb';

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IQuery';
import { IQueryResult } from '../interfaces/IQueryResult';

import Model from './Model';

export default class Collection<T extends IData> {
    collection: MongoDB.Collection;
    modelConstructor: new (data: T) => Model<T>;

    constructor(collection: MongoDB.Collection, modelConstructor: new (data: T) => Model<T>) {
        this.collection = collection;
        this.modelConstructor = modelConstructor;
    }

    create(data: T) {
        let model = new this.modelConstructor(data);
        model.collection = this;
        return model;
    }

    async insert(model: Model<T>) {
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

    async findOne(query: Partial<T>) {
        let result = await this.collection.findOne<T>(query);
        return new this.modelConstructor(result);
    }

    get(id: string | MongoDB.ObjectId) {
        return this.collection.findOne<Model<T>>({
            _id: id
        });
    }

    async list(params: {
        find: IQuery<T>;
        offset: number;
        limit: number;
        sort: any;
    }): Promise<IQueryResult<T>> {
        params = params || {} as any;
        var find = params.find || {};
        var offset = params.offset;
        var limit = params.limit;
        var sort = params.sort;

        let query = this.collection.find<T>(find);
        let count = await query.count();

        if (limit !== 0) {
            query = query.skip(offset || 0)
                .limit(limit);
        }
        if (sort) {
            query = query.sort(sort);
        }

        let data = (await query.toArray()).map(item => new this.modelConstructor(item));

        return {
            count: count,
            results: data
        };
    }

    delete(id: string | MongoDB.ObjectId) {
        return this.collection.remove({
            _id: id
        });
    }
}