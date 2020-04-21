import { Service } from '../src/scripts/SierraData';

import PostModel from './PostModel';
import PostCollection from './PostCollection';

export default class PostService extends Service<PostModel, PostCollection> {
    constructor(gateway: PostCollection) {
        super('api/post', gateway);
    }
}