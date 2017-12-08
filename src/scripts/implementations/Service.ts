import { method, IMiddleware, Controller } from 'sierra';
import Gateway from './Gateway';

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IQuery';

export default class Service<V extends Gateway<any, any, any>> extends Controller {
    gateway: V;

    constructor(base: string, gateway: V) {
        super();
        this.gateway = gateway;
    }

    @method('get', '/:id')
    async get(id: string) {
        return this.gateway.get(id);
    }

    @method('get', '/')
    async list(page: number, pageSize: number, sortedColumn: string, sortedDirection: number) {
        return this.gateway.list({
            find: {} as any,
            select: undefined,
            page: page,
            pageSize: pageSize,
            sort: (function () {
                if (sortedColumn) {
                    var output = {};
                    output[sortedColumn] = (sortedDirection === undefined || sortedDirection) ? 1 : -1;
                    return output;
                }
            })()
        });
    }

    @method('post', '/')
    async post($body) {
        let result = await this.gateway.create($body);
        return result._id;
    }

    @method('put', '/:id')
    async put(id: string, $body) {
        let result = await this.gateway.update(id, $body);
        return true;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        await this.gateway.delete(id);
        return true;
    }
}
