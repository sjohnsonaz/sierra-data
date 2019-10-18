import Model from './Model';
import ModelDefinition, { IPropertyConfig } from './ModelDefinition';
import { IClientData } from '../interfaces/IClientData';

export function prop<
    T extends Model<U>,
    U extends IClientData = IClientData,
    V extends (keyof T & keyof U) = any
>(
    config?: IPropertyConfig<T[V], U[V]>
): (target: T, propertyKey: V) => void {
    return function (target: T, propertyKey: V): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target);
        modelDefinition.addConfig(propertyKey as any, config || {} as any);
    };
}