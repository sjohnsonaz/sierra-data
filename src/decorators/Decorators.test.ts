import { expect } from 'chai';

import Transform from "../transform/Transform";
import TransformConfig from '../transform/TransformConfig';

import { getDecorators } from './Decorators';
import { Model } from '../SierraData';

describe('Decorators', function () {
    it('should support multiple Decorators', function () {
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

    describe('Initialization', function () {
        describe('@defaultValue', function () {
            it('should initialize a value', function () {
                let { defaultValue } = getDecorators<TestClass>();

                class TestClass extends Model<any> {
                    @defaultValue(1234)
                    value: number;
                }

                let testClass = new TestClass();
                testClass.fromClient({});

                expect(testClass.value).to.equal(1234);
            });
        });
    });

    describe('Validation', function () {
        describe('@required', function () {
            it('should not mark if truthy', function () {
                let { required } = getDecorators<TestClass>();

                class TestClass extends Model<any> {
                    @required()
                    requiredTruthy: number = 1;
                }

                let testClass = new TestClass();
                let invalidFields = testClass.validate();

                expect(invalidFields).does.not.include('requiredTruthy');
            });

            it('should not mark if zero or false', function () {
                let { required } = getDecorators<TestClass>();

                class TestClass extends Model<any> {
                    @required()
                    requiredZero: number = 0;

                    @required()
                    requiredFalse: boolean = false;
                }

                let testClass = new TestClass();
                let invalidFields = testClass.validate();

                expect(invalidFields).does.not.include('requiredZero');
                expect(invalidFields).does.not.include('requiredFalse');
            });

            it('should mark if falsy', function () {
                let { required } = getDecorators<TestClass>();

                class TestClass extends Model<any> {
                    @required()
                    requiredUninitialized: number;

                    @required()
                    requiredUndefined: number = undefined;

                    @required()
                    requiredNull: number = null;

                    @required()
                    requiredNaN: number = NaN;

                    @required()
                    requiredEmpty: string = '';
                }

                let testClass = new TestClass();
                let invalidFields = testClass.validate();

                expect(invalidFields).includes('requiredUninitialized');
                expect(invalidFields).includes('requiredUndefined');
                expect(invalidFields).includes('requiredNull');
                expect(invalidFields).includes('requiredNaN');
                expect(invalidFields).includes('requiredEmpty');
            });
        });
    });

    describe('Transformation', function () {
        describe('@transform', function () {
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
                transform
            } = getDecorators<TestClass>()

            class TestClass extends Model<any>{
                @transform('client', String)
                date: Date = new Date(Date.now());

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
        });
    });
});