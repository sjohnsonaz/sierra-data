import Model from './Model';
import { IData } from '../interfaces/IData';

export interface IPropertyConfig<T = any, U = T> {
    type?: any;
    required?: boolean;
    default?: T;
    hide?: boolean;
    reference?: {
        collection: string;
        id: string;
    }
    wrap?: (value: U) => T;
    unwrap?: (value: T) => U;
    validation?: (value: T) => boolean;

    // String
    minLength?: number;
    maxLength?: number;
    trim?: boolean;

    // Number
    minimum?: number;
    maximum?: number;
}

export default class ModelDefinition {
    parent: ModelDefinition;
    propertyConfigs: {
        [index: string]: IPropertyConfig;
    } = {};

    constructor(parent?: ModelDefinition) {
        this.parent = parent;
    }

    getKeys() {
        if (this.parent) {
            return this.parent.getKeys().concat(Object.keys(this.propertyConfigs));
        } else {
            return Object.keys(this.propertyConfigs) || [];
        }
    }

    getConfigs() {
        let configHash: {
            [index: string]: IPropertyConfig;
        };
        if (this.parent) {
            configHash = this.parent.getConfigs();
        } else {
            configHash = {};
        }
        Object.assign(configHash, this.propertyConfigs);
        return configHash;
    }

    getConfig<T extends Model<U>, U extends IData>(key: keyof T) {
        return this.propertyConfigs[key as any];
    }

    addConfig<T extends Model<U>, U extends IData>(key: keyof T, config: IPropertyConfig<T[keyof T], U[keyof U]>) {
        this.propertyConfigs[key as any] = config;
    }

    static getModelDefinition<T extends IData = any>(target: Model<T>) {
        if (target._modelDefinition) {
            if (!target.hasOwnProperty('_modelDefinition')) {
                target._modelDefinition = new ModelDefinition(target._modelDefinition);
            }
        } else {
            target._modelDefinition = new ModelDefinition();
        }
        return target._modelDefinition;
    }
}