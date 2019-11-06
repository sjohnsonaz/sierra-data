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

    it('should handle inheritance', async function () {
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

    it('should handle composition', async function () {
        interface IChild extends IClientData {
            childValue: string;
        }

        class ChildModel extends Model<IChild> {
            @prop() childValue: string = 'parent';
        }

        interface IParent extends IClientData {
            child: IChild;
            stringValue: string;
            numberValue: number;
        }

        class ParentModel extends Model<IParent> {
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

        let parentCollection = collectionFactory.getCollection('testcollection');
        let collection = new Collection<ParentModel>(parentCollection, ParentModel);

        let parentModel = collection.create();
        parentModel.fromClient({});
        await parentModel.save();
        expect(parentModel.stringValue).to.equal('abcd');

        parentModel.stringValue = 'efgh';
        await parentModel.save();

        let result = await collection.get(parentModel._id);
        collection.findOne({ _id: parentModel._id })
        expect(result.stringValue).to.equal('efgh');
    });
});