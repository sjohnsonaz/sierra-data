import { expect } from 'chai';

import { TransformRegistry } from "../scripts/implementations/Transform";

describe('TransformRegistry', function () {
    it('Should convert strings to numbers', function () {
        let transformRegistry = new TransformRegistry();

        function StringNumber(value: string) {
            return Number(value);
        }
        transformRegistry.register(String, Number, StringNumber);
        let result = transformRegistry.convert('1234', Number);
        expect(result).to.equal(1234);
    });

    it('Should convert numbers to strings', function () {
        let transformRegistry = new TransformRegistry();

        function NumberString(value: number) {
            return value.toString();
        }
        transformRegistry.register(Number, String, NumberString);
        let result = transformRegistry.convert(1234, String);
        expect(result).to.equal('1234');
    });
});