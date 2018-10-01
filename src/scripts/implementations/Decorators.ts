import Model from './Model';
import ModelDefinition, { IAllPropertyConfig } from './ModelDefinition';

export function prop<T extends Model<any>>(config?: IAllPropertyConfig) {
    return function (target: T, propertyKey: string): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target);
        modelDefinition.addConfig(propertyKey, config || {});
    };
}