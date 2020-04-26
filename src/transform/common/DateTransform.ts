import Transform from "../Transform";

export default function register(transform: Transform) {
    transform.register(String, Date,
        function StringDate(value: string) {
            return new Date(value);
        },
        function DateString(value: Date) {
            return value.toISOString();
        });
}