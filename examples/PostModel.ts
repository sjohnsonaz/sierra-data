import { prop, ObjectId, Model } from '../src/SierraData';

import { IPost } from './IPost';

export default class PostModel extends Model<IPost> {
    @prop({}) created: Date;
    @prop({}) modified: Date;

    @prop({
        type: String,
        trim: true
    }) title: string;
    @prop({}) body: String;

    beforeInsert() {
        this.created = new Date(Date.now());
        this.modified = this.created;
    }

    beforeUpdate() {
        this.modified = new Date(Date.now());
    }
}