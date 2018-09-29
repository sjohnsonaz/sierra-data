import Model from './Model';
import ModelDefinition, { IPropertyConfig } from './ModelDefinition';

export function prop<T extends Model<any>>(config?: IPropertyConfig) {
    return function (target: T, propertyKey: string): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target);
        modelDefinition.addConfig(propertyKey, config || {});
    };
}