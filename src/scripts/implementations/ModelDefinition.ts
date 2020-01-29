import { IClientData } from '../interfaces/IData';

import Model from './Model';

export interface IPropertyConfig<
    T,
    U,
    V,
    W extends keyof T,
    X extends keyof U,
    Y extends keyof V
    > {
    key?: W;
    clientKey?: X;
    serverKey?: Y;
    type?: any;
    required?: boolean;
    default?: T[W];
    hide?: boolean;
    reference?: {
        collection: string;
        id: string;
    }
    fromClient?: (value: U[X]) => T[W];
    toClient?: (value: T[W]) => U[X];
    fromServer?: (value: V[Y]) => T[W];
    toServer?: (value: T[W]) => V[Y];
    validation?: (value: T[W]) => boolean;

    // String
    minLength?: number;
    maxLength?: number;
    trim?: boolean;

    // Number
    minimum?: number;
    maximum?: number;
}

export interface IModel {
    _modelDefinition: ModelDefinition;
}

export default class ModelDefinition {
    parent: ModelDefinition;
    propertyConfigs: {
        [index: string]: IPropertyConfig<any, any, any, any, any, any>;
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
            [index: string]: IPropertyConfig<any, any, any, any, any, any>;
        };
        if (this.parent) {
            configHash = this.parent.getConfigs();
        } else {
            configHash = {};
        }
        Object.assign(configHash, this.propertyConfigs);
        return configHash;
    }

    getConfig<T extends IModel>(key: keyof T) {
        return this.propertyConfigs[key as any];
    }

    addConfig<T extends IModel>(key: keyof T, config: IPropertyConfig<any, any, any, any, any, any>) {
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