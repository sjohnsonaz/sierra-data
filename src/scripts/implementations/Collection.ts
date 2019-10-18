import * as MongoDB from 'mongodb';

import { IClientData } from '../interfaces/IClientData';
import { IQuery } from '../interfaces/IQuery';
import { IQueryResult } from '../interfaces/IQueryResult';

import Model from './Model';
import { IServerData } from '../interfaces/IServerData';

export default class Collection<
    T extends Model<U, V>,
    U extends IClientData = ReturnType<T['toClient']>,
    V extends IServerData = ReturnType<T['toServer']>
> {
    collection: MongoDB.Collection<V>;
    modelConstructor: new (collection?: Collection<T, U, V>) => T;

    constructor(collection: MongoDB.Collection<V>, modelConstructor: new (collection?: Collection<T, U, V>) => T) {
        this.collection = collection;
        this.modelConstructor = modelConstructor;
    }

    create(): T {
        let model = new this.modelConstructor(this);
        model._collection = this;
        return model;
    }

    async insert(model: T) {
        return await this.collection.insertOne(model.toServer());
    }

    async update(id: string | MongoDB.ObjectId, model: T, overwrite?: boolean) {
        if (typeof id === 'string') {
            id = new MongoDB.ObjectId(id);
        }
        // TODO: Fix typing
        return await this.collection.updateOne({ _id: id } as any, {
            $set: overwrite ?
                model.toServer() :
                model.diff()
        } as any);
    }

    async findOne(query: Partial<V>) {
        let result = await this.collection.findOne(query);
        if (result) {
            let model = this.create();
            model.fromServer(result);
            return model;
        }
    }

    async get(id: string | MongoDB.ObjectId) {
        if (typeof id === 'string') {
            id = new MongoDB.ObjectId(id);
        }

        // TODO: Fix typing
        let result = await this.collection.findOne({
            _id: id
        } as any, {});
        if (result) {
            let model = this.create();
            model.fromServer(result);
            return model;
        }
    }

    async list(params: {
        find: Partial<V>;
        offset: number;
        limit: number;
        sort: any;
    }): Promise<IQueryResult<T>> {
        params = params || {} as any;
        var find = params.find || {};
        var offset = params.offset;
        var limit = params.limit;
        var sort = params.sort;

        let query = this.collection.find(find);
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
            let model = this.create();
            model.fromServer(item);
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

        // TODO: Fix typing
        return this.collection.deleteOne({
            _id: id
        } as any);
    }
}