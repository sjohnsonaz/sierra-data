// Decorator Types
export type PropertyConfig<T> = any;
export type PropertyDecorator<T, U extends keyof T> = (target: T, propertyKey: U) => any;
export type PropertyFactory<T, U extends keyof T> = (config: (value: T[U]) => any) => PropertyDecorator<T, U>;
export type CastPropertyFactory<T, U extends keyof T = keyof T> =
    (config: (value: T[U]) => void, propertyKey?: U)
        => PropertyDecorator<T, U>;

// Decorator Inspection
export type PropertyType<T> = T extends PropertyDecorator<infer TTarget, infer TKey> ?
    TTarget[TKey] :
    any;
export type PropertyFactoryType<T> = T extends PropertyFactory<infer T, infer U> ? T[U] : any;

type propertyType = PropertyType<(target: MethodTest, propertyKey: 'method') => any>;
type factoryType = PropertyFactoryType<(config: (value) => any) => (target: MethodTest, propertyKey: 'testValue') => any>;

export function createDecorator<T>() {
    return function prop<V extends keyof T = keyof T>(config: (value: PropertyType<PropertyDecorator<T, V>>) => void, propertyKey?: V): PropertyDecorator<T, V> {
        return function innerProp(target: T, propertyKey: V) {
            console.log(config(target[propertyKey]));
        }
    }
}

function prop<T, V extends keyof T = keyof T>(config: (value: PropertyType<PropertyDecorator<T, V>>) => void, propertyKey?: V): PropertyDecorator<T, V> {
    return function innerProp(target: T, propertyKey: V) {
        console.log(config(target[propertyKey]));
    }
}

function justDecorator<T, V extends keyof T>(target: T, propertyKey: V) {

}

let decorator = createDecorator<MethodTest>();

class MethodTest {
    @decorator(value => { }, "testNumber")
    testNumber: number;
    @justDecorator
    testString: string;
    //@prop(value => { })
    testValue: number;
    method() { return 1; }
}