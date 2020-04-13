import { expect } from 'chai';

import { TransformRegistry, Constructor } from "../transform/Transform";

describe('TransformRegistry', function () {
    let transformRegistry = new TransformRegistry();

    transformRegistry.register(String, Number,
        value => Number(value),
        value => value.toString());
    transformRegistry.register(String, Date,
        function StringDate(value: string) {
            return new Date(value);
        },
        function DateString(value: Date) {
            return value.toISOString();
        });

    function transform<
        T,
        V extends keyof T = keyof T,
        U extends keyof T = keyof T
    >(from?: Constructor<any>, to?: Constructor<any>) {
        return function innerProp(target: T, propertyKey: V) {
        }
    }

    function newProp<T, V extends keyof T = keyof T>(config: (value: T[V]) => void, propertyKey?: V) {
        return function innerProp(target: T, propertyKey: V) {
            console.log(config(target[propertyKey]));
        }
    }

    type CastProp<T, V extends keyof T = keyof T> = (config: (value: T[V]) => void, propertyKey?: V) => (target: T, propertyKey: V) => any;

    it('Should convert strings to numbers', function () {
        let otherProp: CastProp<Test> = newProp;
        class Test {
            @otherProp((value) => { })
            testValue: number;

            @otherProp((value) => { })
            testValueB: string;
        }
        let testString = '1234';
        let testNumber = 1234;

        let result = transformRegistry.convert(testString, Number);
        expect(result).to.equal(testNumber);
    });
});