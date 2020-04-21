import { expect } from 'chai';

import Transform from "./Transform";
import TransformConfig from './TransformConfig';

describe('TransformConfig', function () {
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

    let now = new Date(Date.now());
    let nowString = now.toISOString();

    let transformConfig = new TransformConfig<any>(transformRegistry);
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