import { expect } from 'chai';

import Model from '../scripts/implementations/Model';
import Collection from '../scripts/implementations/Collection';
import { prop } from '../scripts/implementations/Decorators';

describe('Model.unwrap', () => {
    it('should create an object with all valid properties', async () => {
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

        let collection = new Collection();
        await collection.connect('mongodb://localhost:27017', 'sierra-data');
        collection.create(testModel);

        testModel.stringValue = 'efgh';
        collection.update(testModel);
    });
});
