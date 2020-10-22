import Model from '../../model/Model';
import ModelDefinition from '../../model/ModelDefinition';

export function defaultValue<U extends keyof T, T extends Model<any>>(value: T[U]) {
    return function (
        target: T,
        propertyKey: U
    ) {
        let config = ModelDefinition.getConfig(target, propertyKey);
        config.default = value;
    }
}