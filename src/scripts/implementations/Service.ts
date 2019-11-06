import { method, IMiddleware, Controller } from 'sierra';
import * as MongoDB from 'mongodb';

import { IClientData, IServerData } from '../interfaces/IData';

import Collection from './Collection';
import Model from './Model';

export default class Service<
    T extends Model<any, any>,
    U extends IClientData = ReturnType<T['toClient']>,
    V extends IServerData = ReturnType<T['toServer']>,
    W extends Collection<T, U, V> = Collection<T, U, V>
    > extends Controller {
    collection: W;

    constructor(base: string, collection: W) {
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
        let result = await this.collection.list({
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
        return {
            count: result.count,
            results: result.results.map(data => data.toClient())
        }
    }

    @method('get', '/:id')
    async get(id: string) {
        let _id = new MongoDB.ObjectId(id);
        let model = await this.collection.get(_id);
        return model.toClient();
    }

    @method('post')
    async post($body: U) {
        let model = this.collection.create();
        model.fromClient($body);
        await model.save();
        return model._id.toHexString();
    }

    @method('put', '/:id')
    async put(id: string, $body: U) {
        let model = this.collection.create();
        model.fromClient($body);
        model._id = new MongoDB.ObjectId(id);
        await model.save(true);
        return true;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        let _id = new MongoDB.ObjectId(id);
        await this.collection.delete(_id);
        return true;
    }
}
