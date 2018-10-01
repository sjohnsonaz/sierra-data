import { method, IMiddleware, Controller } from 'sierra';
import * as MongoDB from 'mongodb';

import { IData } from '../interfaces/IData';
import Collection from './Collection';
import Model from './Model';

export default class Service<T extends Model<U>, U extends IData, V extends Collection<T, U>> extends Controller {
    collection: V;

    constructor(base: string, collection: V) {
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
        return await this.collection.get(id);
    }

    @method('post')
    async post($body: U) {
        let model = this.collection.create($body);
        await model.save();
        return model._id;
    }

    @method('put', '/:id')
    async put(id: string, $body: U) {
        let model = this.collection.create($body);
        model._id = new MongoDB.ObjectId(id);
        await model.save();
        return true;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        await this.collection.delete(id);
        return true;
    }
}
