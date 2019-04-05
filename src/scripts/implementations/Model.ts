import * as MongoDB from 'mongodb';

import ModelDefinition from './ModelDefinition';
import { prop } from './Decorators';
import { IData } from "../interfaces/IData";
import Collection from "./Collection";
import CollectionFactory from './CollectionFactory';

export default class Model<T extends IData, U extends Collection<Model<T, any>, T> = any> {
    _modelDefinition: ModelDefinition;
    _collection: U;

    _baseData: Partial<T>;

    @prop<Model<T>, T, '_id'>({
        wrap: (value: string | MongoDB.ObjectId) => {
            if (typeof value === 'string') {
                return new MongoDB.ObjectId(value);
            } else {
                return value;
            }
        },
        unwrap: (value) => {
            if (value && value.toHexString) {
                return value.toHexString();
            } else {
                return value as any;
            }
        }
    }) _id: MongoDB.ObjectId;

    constructor(data?: Partial<T>, collection?: U) {
        Object.defineProperties(this, propertyDefinitions);

        this._collection = collection;
        if (data) {
            this.wrap(data);
        }
    }

    reset() {
        this.wrap(this._baseData);
    }

    update() {
        this._baseData = this.unwrap();
    }

    diff() {
        let keys = this.getKeys();
        let diff: Partial<T> = {};
        if (this._baseData) {
            let differentKeys = keys.forEach(key => {
                if (this[key] !== this._baseData[key]) {
                    diff[key] = this[key];
                }
            });
        }
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
                if (!this[key]) {
                    output.push(key);
                }
            }
        });
        return output;
    }

    wrap(data: Partial<T>) {
        this._baseData = data;
        this.getKeys().forEach(key => this[key] = data[key]);
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

    unwrap(hide?: boolean, references?: boolean | string | string[]): T {
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
                let value;
                if ((typeof config.default !== 'undefined') && (typeof this[key] === 'undefined')) {
                    value = config.default;
                } else {
                    value = this[key];
                }
                if (config.unwrap) {
                    value = config.unwrap(value);
                }
                output[key] = value;
            }
        });
        return output;
    }

    toJSON() {
        return this.unwrap(true);
    }

    async save(overwrite?: boolean) {
        if (this._collection) {
            this.beforeSave();
            if (this._id) {
                this.beforeUpdate(overwrite);
                await this._collection.update(this._id, this, overwrite);
            } else {
                this.beforeInsert();
                await this._collection.insert(this);
            }
        }
    }

    delete() {
        if (this._collection) {
            if (this._id) {
                this.beforeDelete();
                this._collection.delete(this._id);
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