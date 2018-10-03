import Model from './Model';
import ModelDefinition, { IPropertyConfig } from './ModelDefinition';
import { IData } from '../interfaces/IData';

export function prop<T extends Model<U>, U extends IData = any, V extends (keyof T & keyof U) = any>(config?: IPropertyConfig<T[V], U[V]>): (target: T, propertyKey: V) => void {
    return function (target: T, propertyKey: V): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target);
        modelDefinition.addConfig(propertyKey as any, config || {} as any);
    };
}