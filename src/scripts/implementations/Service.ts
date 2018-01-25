import { method, IMiddleware, Controller } from 'sierra';
import Gateway from './Gateway';

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IQuery';
import { IQueryResult } from '../interfaces/IQueryResult';

export default class Service<T extends IData, V extends Gateway<T, any, any, any>> extends Controller {
    gateway: V;

    constructor(base: string, gateway: V) {
        super();
        this.gateway = gateway;
    }

    @method('get')
    async index(offset: string, limit: string, sortedColumn: string, sortedDirection: any) {
        let _offset = parseInt(offset);
        let _limit = parseInt(limit);
        // Prevent limit from being NaN, Inifinity, or 0
        if (!_limit || isNaN(_limit) || !isFinite(_limit)) {
            _limit = 20;
        }
        return this.gateway.list({
            find: {} as any,
            select: undefined,
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
        return this.gateway.get(id);
    }

    @method('post')
    async post($body: T) {
        let result = await this.gateway.create($body);
        return result._id;
    }

    @method('put', '/:id')
    async put(id: string, $body: T) {
        let result = await this.gateway.update(id, $body);
        return true;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        await this.gateway.delete(id);
        return true;
    }
}
