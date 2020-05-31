import Model from '../../model/Model';
import ModelDefinition from '../../model/ModelDefinition';
import { KeysOfType } from './KeysOfType';
import { TransformSet } from '../../transform/TransformSet';

export function min<T extends Model<any>, U extends KeysOfType<T, number> = KeysOfType<T, number>>(value: number) {
    return function (
        target: T,
        propertyKey: U
    ) {
        let config = ModelDefinition.getConfig(target, propertyKey);
        config.minimum = value;
    };
}