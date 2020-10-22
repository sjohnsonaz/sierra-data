import Model from '../../model/Model';
import ModelDefinition from '../../model/ModelDefinition';

let _required;
export function Required<T extends Model<any>>() {
    function required<U extends keyof T>(value: boolean = true) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.required = value;
        };
    }
    if (!_required) {
        _required = required;
    }
    return _required;
}