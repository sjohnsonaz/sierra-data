import { expect } from 'chai';

import { getDecorators } from './Decorators';
import { Model } from '../SierraData';

describe('Decorators', function () {
    it('should support all Decorators', function () {
        let {
            defaultValue,
            required,
            min,
            max
        } = getDecorators<TestClass>();

        class TestClass extends Model<any> {
            @min(0)
            @required()
            @defaultValue(1234)
            testA: number;

            @max(10)
            testString: number;

            @max(10)
            testB: number;
        }

        let testClass = new TestClass();
        testClass.fromClient({});
        expect(testClass.testA).to.equal(1234);
    });
});