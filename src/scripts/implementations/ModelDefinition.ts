import Model from './Model';

export interface IPropertyConfig {
    required?: boolean;
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