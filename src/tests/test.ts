import { expect } from 'chai';

import Model from '../scripts/implementations/Model';
import CollectionFactory from '../scripts/implementations/CollectionFactory';
import { prop } from '../scripts/implementations/Decorators';
import { Collection, IClientData } from '../scripts/SierraData';

describe('Model', function () {
    let collectionFactory = new CollectionFactory();

    before(async function () {
        await collectionFactory.connect('mongodb://localhost:27017', 'sierra-data');
    });

    after(async function () {
        await collectionFactory.close();
    });

    it('should create an object with all valid properties', async function () {
        interface IParent extends IClientData {
            parentValue: string;
        }

        class ParentModel<T extends IParent> extends Model<T> {
            @prop() parentValue: string = 'parent';
        }

        interface ITest extends IParent {
            stringValue: string;
            numberValue: number;
        }

        class TestModel extends ParentModel<ITest> {
            @prop({
                required: true,
                default: 'abcd'
            })
            stringValue: string;

            @prop({
                required: true
            })
            numberValue: number;
        }

        let testCollection = collectionFactory.getCollection('testcollection');
        let collection = new Collection<TestModel>(testCollection, TestModel);

        let testModel = collection.create();
        testModel.fromClient({});
        await testModel.save();
        expect(testModel.stringValue).to.equal('abcd');

        testModel.stringValue = 'efgh';
        await testModel.save();

        let result = await collection.get(testModel._id);
        collection.findOne({ _id: testModel._id })
        expect(result.stringValue).to.equal('efgh');
    });
});