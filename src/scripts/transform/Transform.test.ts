import { expect } from 'chai';

import Transform from "./Transform";

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

    it('Should convert strings to numbers', function () {
        let testString = '1234';
        let testNumber = 1234;

        let result = transform.convert(testString, Number);
        expect(result).to.equal(testNumber);
    });

    it('Should convert numbers to strings', function () {
        let testString = '1234';
        let testNumber = 1234;

        let result = transform.convert(testNumber, String);
        expect(result).to.equal(testString);
    });

    it('Should convert strings to Dates', function () {
        let testDate = new Date(Date.now());

        let result = transform.convert(testDate.toISOString(), Date);
        expect(result.getTime()).to.equal(testDate.getTime());
    });

    it('Should convert Dates to strings', function () {
        let testDate = new Date(Date.now());

        let result = transform.convert(testDate, String);
        expect(result).to.equal(testDate.toISOString());
    });
});