import Model from '../../model/Model';
import ModelDefinition from '../../model/ModelDefinition';
import { KeysOfType } from './KeysOfType';

export function max<T extends Model<any>, U extends KeysOfType<T, number>>(value: number) {
    return function (
        target: T,
        propertyKey: U
    ) {
        let config = ModelDefinition.getConfig(target, propertyKey);
        config.maximum = value;
    };
}