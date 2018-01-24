import * as mongoose from 'mongoose';

import { IData } from '../interfaces/IData';
import { IMethods } from '../interfaces/IMethods';
import { IQuery } from '../interfaces/IQuery';
import { IQueryResult } from '../interfaces/IQueryResult';

import { SchemaModel } from './SchemaModel';

export default class Gateway<T extends IData, V extends SchemaModel<T, any>, U extends IQuery> {
    schemaModel: V;

    constructor(schemaModel: V) {
        this.schemaModel = schemaModel;
    }

    create(data: T) {
        var model = new this.schemaModel.model(data);
        return model.save();
    }

    get(id: string) {
        return this.schemaModel.model.findOne({
            _id: id
        }).exec();
    }

    async list(params: {
        find: U;
        select: string;
        offset: number;
        limit: number;
        sort: any;
    }): Promise<IQueryResult<T & mongoose.Document>> {
        params = params || {} as any;
        var find = params.find || {};
        var select = params.select;
        var offset = params.offset;
        var limit = params.limit;
        var sort = params.sort;

        let count = await this.schemaModel.model.find(find).count().exec();

        var query = this.schemaModel.model.find(find);
        if (select) {
            query = query.select(select);
        }
        if (limit !== 0) {
            query = query.skip(offset || 0)
                .limit(limit);
        }
        if (sort) {
            query = query.sort(sort);
        }

        let data = await query.exec();

        return {
            count: count,
            results: data
        };
    }

    update(id: string, data: T | { $set: U }) {
        return this.schemaModel.model.update({
            _id: id
        }, data, {
                runValidators: true
            }).exec();
    }

    updateQuery(query: Object, data: T | { $set: U }) {
        return this.schemaModel.model.update(query, data, {
            runValidators: true
        }).exec();
    }

    delete(id) {
        return this.schemaModel.model.remove({
            _id: id
        }).exec();
    }
}
