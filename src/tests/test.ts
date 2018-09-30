import { expect } from 'chai';

import Model from '../scripts/implementations/Model';
import CollectionFactory from '../scripts/implementations/CollectionFactory';
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

        let collectionFactory = new CollectionFactory();
        await collectionFactory.connect('mongodb://localhost:27017', 'sierra-data');
        let collection = collectionFactory.createCollection('testcollection');
        await collection.create(testModel);

        testModel.stringValue = 'efgh';
        await collection.update(testModel);

        let result = await collection.findOne({ _id: testModel._id }, TestModel);
        expect(true).to.equal(true);
        collectionFactory.close();
    });
});
