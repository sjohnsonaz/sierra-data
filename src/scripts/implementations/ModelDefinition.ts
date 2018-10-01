import Model from './Model';

export interface IPropertyConfig<T = any> {
    type?: any;
    required?: boolean;
    default?: T;
    hide?: boolean;
    wrap?: (value: T) => T;
    unwrap?: (value: T) => T;
    validation?: (value: T) => boolean;
}

export interface IStringPropertyConfig extends IPropertyConfig<string> {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export interface INumberPropertyConfig extends IPropertyConfig<number> {
    minimum?: number;
    maximum?: number;
}

export type IAllPropertyConfig = IPropertyConfig | IStringPropertyConfig | INumberPropertyConfig;

export default class ModelDefinition {
    parent: ModelDefinition;
    propertyConfigs: {
        [index: string]: IAllPropertyConfig;
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
            [index: string]: IAllPropertyConfig;
        };
        if (this.parent) {
            configHash = this.parent.getConfigs();
        } else {
            configHash = {};
        }
        Object.assign(configHash, this.propertyConfigs);
        return configHash;
    }

    getConfig(key: string) {
        return this.propertyConfigs[key];
    }

    addConfig(key: string, config: IPropertyConfig) {
        this.propertyConfigs[key] = config;
    }

    static getModelDefinition(target: Model<any>) {
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