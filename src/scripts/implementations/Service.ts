import * as mongoose from 'mongoose';

import { method, IMiddleware, Controller } from 'sierra';
import Collection from './Collection';

import { IData } from '../interfaces/IData';
import { ObjectId } from 'bson';

export default class Service<T extends IData, U extends Collection<T>> extends Controller {
    collection: U;

    constructor(base: string, collection: U) {
        super(base);
        this.collection = collection;
    }

    @method('get')
    async index(offset: string, limit: string, sortedColumn: string, sortedDirection: any) {
        let _offset = parseInt(offset);
        let _limit = parseInt(limit);
        // Prevent limit from being NaN, Inifinity, or 0
        if (!_limit || isNaN(_limit) || !isFinite(_limit)) {
            _limit = 20;
        }
        return this.collection.list({
            find: {} as any,
            offset: _offset,
            limit: _limit,
            sort: (function () {
                if (sortedColumn) {
                    var output = {};
                    output[sortedColumn] = (sortedDirection === undefined || sortedDirection) ? 1 : -1;
                    return output;
                }
            })()
        });
    }

    @method('get', '/:id')
    async get(id: string) {
        return this.collection.get(id);
    }

    @method('post')
    async post($body: T) {
        let model = this.collection.create($body);
        await model.save();
        return model._id;
    }

    @method('put', '/:id')
    async put(id: string, $body: T) {
        let model = this.collection.create($body);
        model._id = new ObjectId(id);
        await model.save();
        return true;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        await this.collection.delete(id);
        return true;
    }
}
