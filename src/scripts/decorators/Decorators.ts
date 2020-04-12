import Model from '../model/Model';
import ModelDefinition, { IPropertyConfig } from '../model/ModelDefinition';

export function prop(
    config?: IPropertyConfig<any, any, any, any, any, any>
) {
    return function <T extends Model<any, any, any>, V extends keyof T>(target: T, propertyKey: V): void {
        let modelDefinition = ModelDefinition.getModelDefinition(target as any);
        modelDefinition.addConfig(propertyKey as any, config || {} as any);
    };
}

export function createDecorator<T, V extends keyof T = keyof T>() {
    return function prop(config: (value: T[V]) => void, propertyKey?: V) {
        return function innerProp(target: T, propertyKey: V) {
            console.log(config(target[propertyKey]));
        }
    }
}

function newProp<T, V extends keyof T = keyof T>(config: (value: T[V]) => void, propertyKey?: V) {
    return function innerProp(target: T, propertyKey: V) {
        console.log(config(target[propertyKey]));
    }
}

type CastProp<T, V extends keyof T = keyof T> = (config: (value: T[V]) => void, propertyKey?: V) => (target: T, propertyKey: V) => any;

let testProp = createDecorator<Test>();
let otherProp: CastProp<Test> = newProp;

class Test {
    @testProp((value) => { }, 'testValueB')
    testValue: number;

    @otherProp((value) => { })
    testValueB: string;
}

let test = new Test();
