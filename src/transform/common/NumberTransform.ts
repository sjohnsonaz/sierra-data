import Transform from "../Transform";

export default function register(transform: Transform) {
    transform.register(String, Number,
        value => Number(value),
        value => value.toString());
}