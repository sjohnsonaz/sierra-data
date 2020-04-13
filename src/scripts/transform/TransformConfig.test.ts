import { expect } from 'chai';

import Transform from "./Transform";
import TransformConfig from './TransformConfig';
import { Model, ModelDefinition } from '../SierraData';
import { getDecorators } from '../decorators/Decorators';

describe('Transform', function () {
    let transformRegistry = new Transform();

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

    let {
        type,
        transform
    } = getDecorators<TestClass>()

    class TestClass extends Model<any>{
        @type(Date)
        @transform('client', String)
        date: Date = new Date(Date.now());

        @type(String)
        @transform('client', Number)
        string: string = '1234';
    }

    let testClass = new TestClass();
    //let fullTransformConfig = ModelDefinition.getFullTransformConfig(testClass);
    //console.log(fullTransformConfig.transformSetHash);
    //console.log(fullTransformConfig.types);
    let output = testClass.transformTo('client', transformRegistry);
    console.log(output);

    let now = new Date(Date.now());
    let nowString = now.toISOString();

    let transformConfig = new TransformConfig<TestClass>(transformRegistry);
    transformConfig.setType('date', Date);

    transformConfig.register('client', 'date', String);

    it('Should convert strings to Dates', function () {
        let result = transformConfig.from('client', 'date', nowString);
        expect(result.getTime()).to.equal(now.getTime());
    });

    it('Should convert Dates to strings', function () {
        let result = transformConfig.to('client', 'date', now);
        expect(result).to.equal(nowString);
    });
});