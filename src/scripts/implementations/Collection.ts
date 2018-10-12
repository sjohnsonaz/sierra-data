import * as MongoDB from 'mongodb';

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IQuery';
import { IQueryResult } from '../interfaces/IQueryResult';

import Model from './Model';

export default class Collection<T extends Model<U>, U extends IData = ReturnType<T['unwrap']>> {
    collection: MongoDB.Collection;
    modelConstructor: new (data: Partial<U>, collection?: Collection<T, U>) => T;

    constructor(collection: MongoDB.Collection, modelConstructor: new (data: Partial<U>, collection?: Collection<T, U>) => T) {
        this.collection = collection;
        this.modelConstructor = modelConstructor;
    }

    create(data?: Partial<U>) {
        let model = new this.modelConstructor(data, this);
        model._collection = this;
        return model;
    }

    async insert(model: T) {
        let result = await this.collection.insertOne(model.unwrap());
        model._id = result.insertedId;
        model.update();
        return model;
    }

    async update(id: string | MongoDB.ObjectId, model: T, overwrite?: boolean) {
        if (typeof id === 'string') {
            id = new MongoDB.ObjectId(id);
        }
        let result = await this.collection.updateOne({ _id: id }, {
            $set: overwrite ?
                model.unwrap() :
                model.diff()
        });
        model.update();
        return model;
    }

    async findOne(query: Partial<U>) {
        let result = await this.collection.findOne<U>(query);
        if (result) {
            return this.create(result);
        }
    }

    async get(id: string | MongoDB.ObjectId) {
        if (typeof id === 'string') {
            id = new MongoDB.ObjectId(id);
        }
        let result = await this.collection.findOne<U>({
            _id: id
        });
        if (result) {
            return this.create(result);
        }
    }

    async list(params: {
        find: IQuery<U>;
        offset: number;
        limit: number;
        sort: any;
    }): Promise<IQueryResult<T>> {
        params = params || {} as any;
        var find = params.find || {};
        var offset = params.offset;
        var limit = params.limit;
        var sort = params.sort;

        let query = this.collection.find<U>(find);
        let count = await query.count();

        if (limit !== 0) {
            query = query.skip(offset || 0)
                .limit(limit);
        }
        if (sort) {
            query = query.sort(sort);
        }

        let array = await query.toArray();
        let data = array.map((item) => {
            let model = new this.modelConstructor(item);
            model._collection = this;
            return model;
        });

        return {
            count: count,
            results: data
        };
    }

    delete(id: string | MongoDB.ObjectId) {
        if (typeof id === 'string') {
            id = new MongoDB.ObjectId(id);
        }
        return this.collection.remove({
            _id: id
        });
    }
}