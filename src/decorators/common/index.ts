export * from './DefaultValue';
export { Required } from './Required';
export * from './Min';
export * from './Max';

export class Decorators<T> {
    //defaultValue = defaultValue;
    //required = Required<T>();
}

export function getDecorators<T>() {
    return new Decorators<T>();
}