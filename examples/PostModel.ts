import { prop, Model, getDecorators } from '../src/SierraData';

import { IPost } from './IPost';

let { transform, trim } = getDecorators<PostModel>();

export default class PostModel extends Model<IPost> {
    @transform('client', String)
    created: Date;

    @transform('client', String)
    modified: Date;

    @trim()
    title: string;

    @prop() body: String;

    beforeInsert() {
        this.created = new Date(Date.now());
        this.modified = this.created;
    }

    beforeUpdate() {
        this.modified = new Date(Date.now());
    }
}