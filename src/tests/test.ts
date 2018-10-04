import { expect } from 'chai';
import * as MongoDB from 'mongodb';

import Model from '../scripts/implementations/Model';
import CollectionFactory from '../scripts/implementations/CollectionFactory';
import { prop } from '../scripts/implementations/Decorators';
import { Collection, IData } from '../scripts/SierraData';

describe('Model.unwrap', () => {
    it('should create an object with all valid properties', async () => {
        interface IParent extends IData {
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

        let collectionFactory = new CollectionFactory();
        try {
            await collectionFactory.connect('mongodb://localhost:27017', 'sierra-data');
            let testCollection = collectionFactory.getCollection('testcollection');
            let collection = new Collection(testCollection, TestModel);

            let testModel = collection.create();
            await collection.insert(testModel);

            testModel.stringValue = 'efgh';
            await collection.update(testModel._id, testModel);

            let result = await collection.get(testModel._id);
            expect(true).to.equal(true);
        }
        finally {
            collectionFactory.close();
        }
    });
});
