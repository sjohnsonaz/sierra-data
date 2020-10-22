import { Required, getDecorators, defaultValue, min } from './common';
import { Model } from '../SierraData';

let required = Required<Test>();

//let { defaultValue } = getDecorators<Test>();

class Test extends Model<any>{
    @required()
    value: number;

    @defaultValue<'name', Test>(1)
    name: number;

    @min<Test>(1)
    num: number;
}

function deco<T, U extends keyof T = keyof T>(defaultValue: T[U]) {
    return function (target: T, propertyKey: U) {

    }
}
class Example {
    @deco<Example>(1)
    value: number;
}