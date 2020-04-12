import Model from '../model/Model';
import ModelDefinition, { IPropertyConfig } from '../model/ModelDefinition';

export function prop(
    config?: IPropertyConfig<any, any, any, any, any, any>
) {
    return function<T extends Model<any, any, any>, V extends keyof T> (target: T, propertyKey: V): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target as any);
        modelDefinition.addConfig(propertyKey as any, config || {} as any);
    };
}