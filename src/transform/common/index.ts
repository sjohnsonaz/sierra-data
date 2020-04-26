import Transform from "../Transform";
import DateTransform from './DateTransform';
import NumberTransform from './NumberTransform';
import ObjectIdTransform from './ObjectIdTransform';

export default function register(transform: Transform) {
    DateTransform(transform);
    NumberTransform(transform);
    ObjectIdTransform(transform);
}