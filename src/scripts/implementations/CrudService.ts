import { route, IMiddleware } from 'sierra';
import Service from './Service';
import Gateway from './Gateway';

export default class CrudService<T, U extends IMiddleware, V extends Gateway<any>> extends Service<T, U, V> {
    constructor(base: string, gateway: V) {
        super(base, gateway);
    }

    @route('get', '/:id', false)
    get(req, res, next) {
        this.gateway.get(req.params.id, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }

    @route('get', '/', false)
    list(req, res, next) {
        console.log(this);
        this.gateway.list({
            find: {},
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
        }, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }

    @route('post', '/', false)
    post(req, res, next) {
        this.gateway.create(req.body, function (err, result) {
            if (err || !result) {
                return next(err);
            } else {
                res.json(result._id);
            }
        });
    }

    @route('put', '/:id', false)
    put(req, res, next) {
        this.gateway.update(req.params.id, req.body, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result.ok);
            }
        });
    }

    @route('delete', '/:id', false)
    delete(req, res, next) {
        this.gateway.delete(req.params.id, function (err) {
            if (err) {
                return next(err);
            } else {
                res.json(true);
            }
        });
    }
}
