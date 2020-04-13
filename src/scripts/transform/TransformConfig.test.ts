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

        @type(Number)
        @transform('client', String)
        number: number = 1234;
    }

    let testClass = new TestClass();

    it('Should convert to client', function () {
        let output = testClass.transformTo('client', transformRegistry);
        expect(output.date).to.equal(testClass.date.toISOString());
        expect(output.number).to.equal('1234');
    });

    it('Should convert from client', function () {
        let date = new Date(Date.now());
        testClass.transformFrom('client', {
            date: date,
            number: '4321'
        }, transformRegistry);
        expect(testClass.date.getTime()).to.equal(testClass.date.getTime());
        expect(testClass.number).to.equal(4321);
    });

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