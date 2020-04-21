import { Collection, CollectionFactory } from '../src/SierraData';
import PostModel from './PostModel';

export default class PostCollection extends Collection<PostModel> {
    constructor(collectionFactory: CollectionFactory) {
        super(collectionFactory.getCollection('posts'), PostModel);
    }
}