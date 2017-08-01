import * as mongoose from 'mongoose';

export interface IMethods {
    [index: string]: () => any;
}

export abstract class SchemaModel<T extends IMethods> {
    schema: mongoose.Schema;
    constructor() {

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
    abstract defineMethods(): T;
    abstract defineIndex(): { [index: string]: number }
    abstract defineEventHandlers(schema: mongoose.Schema);
}

export interface IDataDefinition {

}

export interface ISchemaDocument<T extends IMethods> extends mongoose.Document, IDataDefinition, T {
}

export default mongoose.model<ISchemaDocument>('User', SchemaModel.schema);
