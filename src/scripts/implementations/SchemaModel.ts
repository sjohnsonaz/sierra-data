import * as mongoose from 'mongoose';

import { IData } from '../interfaces/IData';
import { IMethods } from '../interfaces/IMethods';

abstract class Schema<U extends IMethods> extends mongoose.Schema {
    methods: U;
}

export abstract class SchemaModel<T extends IData, U extends IMethods> {
    schema: Schema<U>;
    model: mongoose.Model<T & U & mongoose.Document>;

    constructor(collection: string) {
        this.init();
        this.model = mongoose.model<T & U & mongoose.Document>(collection, this.schema);
    }

    init() {
        this.initSchema();
        this.initMethods();
        this.initIndex();
        this.initEventHandlers();
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
