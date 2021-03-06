import Model from '../model/Model';
import ModelDefinition, { IPropertyConfig } from '../model/ModelDefinition';
import Transform, { Constructor } from '../transform/Transform';

export function prop(
    config?: IPropertyConfig<any, any, any, any, any, any>
) {
    return function <T extends Model<any, any, any>, V extends keyof T>(target: T, propertyKey: V): void {
        ModelDefinition.addConfig(target, propertyKey, config || {} as any);
    };
}

type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never
}[keyof T];

export class Decorators<T extends Model<any>> {
    prop<U extends keyof T>(
        target: T,
        propertyKey: U
    ) {

    }

    defaultValue<U extends keyof T>(value: T[U]) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.default = value;
        }
    }

    required<U extends keyof T>(value: boolean = true) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.required = value;
        };
    }

    min<U extends KeysOfType<T, number>>(value: number) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.minimum = value;
        };
    }

    max<U extends KeysOfType<T, number>>(value: number) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.maximum = value;
        };
    }

    minLength<U extends KeysOfType<T, string>>(value: number) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.minLength = value;
        };
    }

    maxLength<U extends KeysOfType<T, string>>(value: number) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.maxLength = value;
        };
    }

    trim<U extends keyof T>(value: boolean = true) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.trim = value;
        };
    }

    transform<U extends keyof T>(transformSet: string, to?: Constructor<any>) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            let modelDefinition = ModelDefinition.getModelDefinition(target);
            modelDefinition.transformConfig.register(transformSet, propertyKey as never, to);
            if (!modelDefinition.transformConfig.getType(propertyKey as never)) {
                let type = Reflect.getMetadata("design:type", target, propertyKey as any);
                modelDefinition.transformConfig.setType(propertyKey as never, type);
            }
        };
    }

    type<U extends keyof T>(constructor?: Constructor<T[U]>) {
        return function (
            target: T,
            propertyKey
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            let modelDefinition = ModelDefinition.getModelDefinition(target);
            if (!constructor) {
                constructor = Reflect.getMetadata("design:type", target, propertyKey as any);
            }
            if (constructor) {
                modelDefinition.transformConfig.setType(propertyKey as never, constructor as any);
            }
        };
    }
}

let decorators: Decorators<any>;
export function getDecorators<T extends Model<any>>() {
    if (!decorators) {
        decorators = new Decorators();
    }
    return decorators as Decorators<T>;
}