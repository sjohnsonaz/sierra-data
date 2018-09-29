import { ObjectID } from "bson";

import ModelDefinition from './ModelDefinition';
import { prop } from './Decorators';

export interface IModel {
    _id: ObjectID;
}

export default class Model<T> {
    _modelDefinition: ModelDefinition;

    baseData: T;

    @prop() _id: ObjectID;

    constructor(data?: T) {
        if (data) {
            this.wrap(data);
        }
    }

    reset() {
        this.wrap(this.baseData);
    }

    update() {
        this.baseData = this.unwrap();
    }

    diff() {
        let keys = this.getKeys();
        let diff = {};
        if (this.baseData) {
            let differentKeys = keys.forEach(key => {
                if (this[key] !== this.baseData[key]) {
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

    getConfig(key: string) {
        if (this._modelDefinition) {
            return this._modelDefinition.getConfig(key);
        }
    }

    validate() {
        let output = [];
        this.getKeys().forEach(key => {
            let config = this.getConfig(key);
            if (config && config.required) {
                if (!this[key]) {
                    output.push(key);
                }
            }
        });
        return output;
    }

    wrap(data: T) {
        this.baseData = data;
        this.getKeys().forEach(key => this[key] = data[key]);
    }

    unwrap(): T {
        let output: T = {} as any;
        this.getKeys().forEach(key => output[key] = this[key]);
        return output;
    }
}