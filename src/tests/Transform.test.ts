import { expect } from 'chai';

import { TransformRegistry } from "../scripts/implementations/Transform";

describe('TransformRegistry', function () {
    let transformRegistry = new TransformRegistry();

    transformRegistry.register(String, Number, value => Number(value));
    transformRegistry.register(Number, String, value => value.toString());
    transformRegistry.register(String, Date, function StringDate(value: string) {
        return new Date(value);
    });
    transformRegistry.register(Date, String, function DateString(value: Date) {
        return value.toISOString();
    });

    it('Should convert strings to numbers', function () {
        let result = transformRegistry.convert('1234', Number);
        expect(result).to.equal(1234);
    });

    it('Should convert numbers to strings', function () {
        let result = transformRegistry.convert(1234, String);
        expect(result).to.equal('1234');
    });

    it('Should convert numbers to strings', function () {
        let result = transformRegistry.convert(1234, String);
        expect(result).to.equal('1234');
    });

    it('Should convert strings to Dates', function () {
        let now = new Date(Date.now()).toISOString();

        let result = transformRegistry.convert(now, Date);
        expect(result.toISOString()).to.equal(now);
    });
});