import Model from './Model';
import { IClientData } from '../interfaces/IClientData';

export interface IPropertyConfig<T = any, U = T, V = T> {
    clientKey?: string;
    serverKey?: string;
    type?: any;
    required?: boolean;
    default?: T;
    hide?: boolean;
    reference?: {
        collection: string;
        id: string;
    }
    fromClient?: (value: U) => T;
    toClient?: (value: T) => U;
    fromServer?: (value: V) => T;
    toServer?: (value: T) => V;
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

    getConfig<T extends Model<U>, U extends IClientData>(key: keyof T) {
        return this.propertyConfigs[key as any];
    }

    addConfig<T extends Model<U>, U extends IClientData>(key: keyof T, config: IPropertyConfig<T[keyof T], U[keyof U]>) {
        this.propertyConfigs[key as any] = config;
    }

    static getModelDefinition<T extends IClientData = any>(target: Model<T>) {
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