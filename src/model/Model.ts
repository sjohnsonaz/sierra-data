import * as MongoDB from 'mongodb';

import { IClientData, IData } from "../interfaces/IData";

import ModelDefinition from './ModelDefinition';
import { prop } from '../decorators/Decorators';
import Collection from "../collection/Collection";
import CollectionFactory from '../collection/CollectionFactory';
import Transform from '../transform/Transform';

export default class Model<
    T extends IClientData,
    U extends IData<T> = IData<T>,
    V extends Collection<Model<T, U, any>> = Collection<Model<T, U, any>>
    > {
    _modelDefinition: ModelDefinition;
    _collection: V;

    _baseData: Partial<T>;

    @prop({
        fromClient: (value: string | MongoDB.ObjectId) => {
            if (typeof value === 'string') {
                return new MongoDB.ObjectId(value);
            } else {
                return value;
            }
        },
        toClient: (value) => {
            if (value && value.toHexString) {
                return value.toHexString();
            } else {
                return value as any;
            }
        }
    }) _id: MongoDB.ObjectId;

    constructor(collection?: V) {
        Object.defineProperties(this, propertyDefinitions);

        this._collection = collection;
    }

    reset() {
        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            this[key] = this._baseData[key];
        });
    }

    update() {
        let configs = this.getConfigs();
        if (!this._baseData) {
            this._baseData = {}
        }
        Object.keys(configs).forEach(key => {
            this._baseData[key] = this[key];
        });
    }

    diff() {
        let keys = this.getKeys();
        let diff: Partial<T> = {};
        let baseData = this._baseData;
        let differentKeys = keys.forEach(key => {
            if (this[key] !== baseData[key]) {
                diff[key] = this[key];
            }
        });
        return diff;
    }

    getKeys() {
        if (this._modelDefinition) {
            return this._modelDefinition.getKeys();
        } else {
            return [];
        }
    }

    getConfig(key: keyof ThisType<T>) {
        if (this._modelDefinition) {
            return this._modelDefinition.getConfig(key);
        }
    }

    getConfigs() {
        if (this._modelDefinition) {
            return this._modelDefinition.getConfigs();
        } else {
            return {};
        }
    }

    validate() {
        let output = [];
        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (config && config.required) {
                let value = this[key];
                if (!value && value !== 0 && value !== false) {
                    output.push(key);
                }
            }
        });
        return output;
    }

    build(collectionFactory: CollectionFactory, references: string | string[]) {
        let referenceHash = {};
        switch (typeof references) {
            case 'string':
                referenceHash[references as string] = true;
                break;
            case 'object':
                if (references instanceof Array) {
                    references.forEach(reference => {
                        referenceHash[reference] = true;
                    });
                }
                break;
        }

        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (config.reference && referenceHash[key]) {
                if (config.reference.collection && config.reference.id) {
                    let collection = collectionFactory.getCollection(config.reference.collection);
                    if (collection) {
                    }
                }
            }
        });
    }

    fromClient(data: Partial<T>) {
        data = data || {};
        this._baseData = {};
        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if ((typeof config.default !== 'undefined') && (typeof data[key] === 'undefined')) {
                let value = config.default;
                this[key] = value;
                this._baseData[key] = value;
            } else {
                let value = config.fromClient ? config.fromClient(data[key]) : data[key];
                if (config.trim && typeof value === 'string') {
                    value = value.trim();
                }
                this[key] = value;
                this._baseData[key] = value;
            }
        });
    }

    toClient(hide?: boolean, references?: boolean | string | string[]): T {
        let output: T = {} as any;
        let configs = this.getConfigs();
        let useReferences: boolean;
        let referenceHash = {};
        switch (typeof references) {
            case 'boolean':
                useReferences = references as boolean;
                break;
            case 'string':
                useReferences = true;
                referenceHash[references as string] = true;
                break;
            case 'object':
                if (references instanceof Array) {
                    useReferences = true;
                    references.forEach(reference => {
                        referenceHash[reference] = true;
                    });
                }
                break;
        }

        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (!hide || !config.hide) {
                if (config.reference) {

                }
                output[key] = config.toClient ? config.toClient(this[key]) : this[key];
            }
        });
        return output;
    }

    fromServer(data: Partial<U>) {
        data = data || {};
        this._baseData = {};
        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            let config = configs[key];

            // TODO: Should a default be used coming from the Server?
            if ((typeof config.default !== 'undefined') && (typeof data[key] === 'undefined')) {
                let value = config.default;
                this[key] = value;
                this._baseData[key] = value;
            } else {
                let value = config.fromServer ? config.fromServer(data[key]) : data[key];
                if (config.trim && typeof value === 'string') {
                    value = value.trim();
                }
                this[key] = value;
                this._baseData[key] = value;
            }
        });
    }

    toServer(hide?: boolean, references?: boolean | string | string[]): U {
        let output: U = {} as any;
        let configs = this.getConfigs();
        let useReferences: boolean;
        let referenceHash = {};
        switch (typeof references) {
            case 'boolean':
                useReferences = references as boolean;
                break;
            case 'string':
                useReferences = true;
                referenceHash[references as string] = true;
                break;
            case 'object':
                if (references instanceof Array) {
                    useReferences = true;
                    references.forEach(reference => {
                        referenceHash[reference] = true;
                    });
                }
                break;
        }

        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (!hide || !config.hide) {
                if (config.reference) {

                }
                output[key] = config.toServer ? config.toServer(this[key]) : this[key];
            }
        });
        return output;
    }

    transformTo(transformSetName: string, transform?: Transform) {
        let output: T = {} as any;
        let configs = this.getConfigs();
        let transformConfig = ModelDefinition.getFullTransformConfig(this as any);
        if (transform) {
            transformConfig.setTransform(transform);
        }
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (!config.hide) {
                output[key] = transformConfig.to(transformSetName, key as never, this[key]);
            }
        });
        return output;
    }

    transformFrom<T>(transformSetName: string, data: T, transform?: Transform) {
        data = data || {} as any;
        this._baseData = {};
        let configs = this.getConfigs();
        let transformConfig = ModelDefinition.getFullTransformConfig(this as any);
        if (transform) {
            transformConfig.setTransform(transform);
        }
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if ((typeof config.default !== 'undefined') && (typeof data[key] === 'undefined')) {
                let value = config.default;
                this[key] = value;
                this._baseData[key] = value;
            } else {
                let value = transformConfig.from(transformSetName, key as never, data[key]);
                if (config.trim && typeof value === 'string') {
                    value = value.trim();
                }
                this[key] = value;
                this._baseData[key] = value;
            }
        });
    }

    toJSON() {
        return this.toClient(true);
    }

    async save(overwrite?: boolean) {
        if (this._collection) {
            this.beforeSave();
            if (this._id) {
                this.beforeUpdate(overwrite);
                let result = await this._collection.update(this._id, this, overwrite);
                this.update();
                return result;
            } else {
                this.beforeInsert();
                let result = await this._collection.insert(this);
                this._id = result.insertedId;
                this.update();
                return result;
            }
            // return this._id;
        }
    }

    async delete() {
        if (this._collection) {
            if (this._id) {
                this.beforeDelete();
                await this._collection.delete(this._id);
                // TODO: Use result
                this._id = undefined;
            }
        }
    }

    beforeSave() {

    }

    beforeInsert() {

    }

    beforeUpdate(overwrite?: boolean) {

    }

    beforeDelete() {

    }
}

let propertyDefinitions = {
    _baseData: {
        enumerable: false,
        writable: true,
        configurable: true
    },
    _collection: {
        enumerable: false,
        writable: true,
        configurable: true
    }
};