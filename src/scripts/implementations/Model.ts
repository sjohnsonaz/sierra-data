import * as MongoDB from 'mongodb';

import ModelDefinition from './ModelDefinition';
import { prop } from './Decorators';
import { IData } from "../interfaces/IData";
import Collection from "./Collection";

export default class Model<T extends IData> {
    _modelDefinition: ModelDefinition;
    _collection: Collection<Model<T>, T>;

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
            return value.toHexString();
        }
    }) _id: MongoDB.ObjectId;

    constructor(data?: Partial<T>) {
        Object.defineProperties(this, propertyDefinitions);

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

    unwrap(hide?: boolean): T {
        let output: T = {} as any;
        let configs = this.getConfigs();
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            if (!hide || !config.hide) {
                output[key] = this[key];
            }
            if ((typeof config.default !== 'undefined') && (typeof this[key] === 'undefined')) {
                output[key] = config.default;
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