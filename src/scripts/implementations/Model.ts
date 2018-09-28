export default class Model<T> {
    _modelDefinition: ModelDefinition;

    baseData: T;

    constructor(data?: T) {
        if (data) {
            this.wrap(data);
        }
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

export class ModelDefinition {
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

export interface IPropertyConfig {
    required?: boolean;
}

export function prop<T extends Model<any>>(config?: IPropertyConfig) {
    return function (target: T, propertyKey: string): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target);
        modelDefinition.addConfig(propertyKey, config || {});
    };
}