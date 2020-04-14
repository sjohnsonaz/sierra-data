import Transform, { Constructor } from "./Transform";

export class TransformSet<T> {
    transformHash: {
        [index: string]: Constructor<any>
    } = {};

    register(key: keyof T, to: Constructor<any>) {
        this.transformHash[key as any] = to;
    }

    to<U extends keyof T>(transform: Transform, key: keyof T, value: T[U]) {
        let to = this.transformHash[key as any];
        if (to) {
            return transform.convert(value, to);
        } else {
            return value;
        }
    }

    from<U, V>(transform: Transform, key: keyof T, value: U, to: Constructor<V>): V {
        let from = this.transformHash[key as any];
        if (from) {
            if (!to) {
                throw 'Unable to determine transform type';
            } else {
                return transform.run(value, from, to);
            }
        } else {
            // TODO: Should we cast?
            return value as any;
        }
    }

    static merge(destination: TransformSet<any>, source: TransformSet<any>) {
        Object.assign(destination.transformHash, source.transformHash);
    }
}