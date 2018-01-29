import * as mongoose from 'mongoose';

import { IData } from '../interfaces/IData';
import { IMethods } from '../interfaces/IMethods';

export abstract class Schema<U extends IMethods> extends mongoose.Schema {
    methods: U;
}

export declare type ISchemaDefinition<T> = {
    [P in keyof T]: mongoose.SchemaTypeOpts<any> | mongoose.Schema | mongoose.SchemaType;
}

export abstract class SchemaModel<T extends IData, U extends IMethods> {
    collection: string;
    schema: Schema<U>;
    model: mongoose.Model<T & U & mongoose.Document>;

    constructor(collection: string) {
        this.init(collection);
    }

    init(collection: string) {
        this.collection = collection;
        this.initSchema();
        this.initMethods();
        this.initIndex();
        this.initEventHandlers();
        this.model = mongoose.model<T & U & mongoose.Document>(collection, this.schema);
    }

    initSchema() {
        this.schema = new mongoose.Schema(this.defineSchema());
    }

    initMethods() {
        this.schema.methods = this.defineMethods();
    }

    initIndex() {
        this.schema.index(this.defineIndex());
    }

    initEventHandlers() {
        this.defineEventHandlers(this.schema);
    }

    abstract defineSchema(): mongoose.SchemaDefinition;
    abstract defineMethods(): U;
    abstract defineIndex(): { [index: string]: number }
    abstract defineEventHandlers(schema: mongoose.Schema);
}
