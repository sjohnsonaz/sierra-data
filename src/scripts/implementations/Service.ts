import { route, IMiddleware, Controller } from 'sierra';
import Gateway from './Gateway';

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IQuery';

export default class Service<T, U extends IMiddleware, V extends IData, W extends IQuery, X extends Gateway<V, any, W>> extends Controller<T, U> {
    gateway: X;

    constructor(base: string, gateway: X) {
        super();
        this.gateway = gateway;
    }

    @route('get', '/:id', false)
    async get(req, res, next) {
        try {
            let result = await this.gateway.get(req.params.id);
            res.json(result);
        }
        catch (e) {
            next(e);
        }
    }

    @route('get', '/', false)
    async list(req, res, next) {
        try {
            let result = await this.gateway.list({
                find: {} as any,
                select: undefined,
                page: req.query.page,
                pageSize: req.query.pageSize,
                sort: (function () {
                    if (req.query.sortedColumn) {
                        var output = {};
                        output[req.query.sortedColumn] = (req.query.sortedDirection === undefined || req.query.sortedDirection) ? 1 : -1;
                        return output;
                    }
                })()
            });
            res.json(result);
        }
        catch (e) {
            next(e);
        }
    }

    @route('post', '/', false)
    async post(req, res, next) {
        try {
            let result = await this.gateway.create(req.body);
            res.json(result._id);
        }
        catch (e) {
            next(e);
        }
    }

    @route('put', '/:id', false)
    async put(req, res, next) {
        try {
            let result = await this.gateway.update(req.params.id, req.body);
            res.json(result.ok);
        }
        catch (e) {
            next(e);
        }
    }

    @route('delete', '/:id', false)
    async delete(req, res, next) {
        try {
            await this.gateway.delete(req.params.id);
            res.json(true);
        }
        catch (e) {
            next(e);
        }
    }
}
