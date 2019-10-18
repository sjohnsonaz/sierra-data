import { expect } from 'chai';
import * as MongoDB from 'mongodb';

import Model from '../scripts/implementations/Model';
import CollectionFactory from '../scripts/implementations/CollectionFactory';
import { prop } from '../scripts/implementations/Decorators';
import { Collection, IClientData } from '../scripts/SierraData';

describe('Model.unwrap', () => {
    it('should create an object with all valid properties', async () => {
        interface IParent {
            parentValue: string;
        }

        class ParentModel<T extends IParent> extends Model<T & IClientData> {
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

        let collectionFactory = new CollectionFactory();
        try {
            await collectionFactory.connect('mongodb://localhost:27017', 'sierra-data');
            let testCollection = collectionFactory.getCollection('testcollection');
            let collection = new Collection<TestModel>(testCollection, TestModel);

            let testModel = collection.create();
            testModel.fromClient({});
            await testModel.save();
            // await collection.insert(testModel);
            expect(testModel.stringValue).to.equal('abcd');

            testModel.stringValue = 'efgh';
            await testModel.save();
            // await collection.update(testModel._id, testModel);

            let result = await collection.get(testModel._id);
            collection.findOne({_id: testModel._id})
            expect(result.stringValue).to.equal('efgh');
        }
        finally {
            collectionFactory.close();
        }
    });
});
