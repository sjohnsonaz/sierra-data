import Model from '../../model/Model';
import ModelDefinition, { IPropertyConfig } from '../../model/ModelDefinition';

export class Decorators<T extends Model<any>> {
    required<U extends keyof T>(value: boolean = true) {
        return function (
            target: T,
            propertyKey: U
        ) {
            let config = ModelDefinition.getConfig(target, propertyKey);
            config.required = value;
        };
    }
}

export namespace Required {
    export function req() {
        console.log('1234123412343');
    }
}