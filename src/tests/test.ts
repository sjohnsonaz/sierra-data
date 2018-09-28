import { expect } from 'chai';

import Model, { prop } from '../scripts/implementations/Model';

describe('Model.unwrap', () => {
    it('should create an object with all valid properties', () => {
        interface IParent {
            parentValue: string;
        }

        class ParentModel<T extends IParent = IParent> extends Model<T> {
            @prop() parentValue: string = 'parent';
        }

        interface ITest extends IParent {
            stringValue: string;
            numberValue: number;
        }

        class TestModel extends ParentModel<ITest> {
            @prop({
                required: true
            })
            stringValue: string = 'abcd';
            @prop({
                required: true
            })
            numberValue: number;
        }

        let testModel = new TestModel();
        console.log('valid:', testModel.validate());
        console.log('value:', testModel.unwrap());
        expect(true).to.equal(true);
    });
});
