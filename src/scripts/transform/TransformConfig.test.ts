import { expect } from 'chai';

import Transform from "./Transform";
import TransformConfig from './TransformConfig';

describe('Transform', function () {
    let transform = new Transform();

    transform.register(String, Number,
        value => Number(value),
        value => value.toString());
    transform.register(String, Date,
        function StringDate(value: string) {
            return new Date(value);
        },
        function DateString(value: Date) {
            return value.toISOString();
        });

    class TestClass {
        date: Date;
    }

    let testClass = new TestClass();

    let now = new Date(Date.now());
    let nowString = now.toISOString();

    let transformConfig = new TransformConfig<TestClass>(transform);
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