import { ObjectId } from "bson";

import Transform from "../Transform";

export default function register(transform: Transform) {
    transform.register(String, ObjectId,
        value => new ObjectId(value.toString()),
        value => value.toString());
}