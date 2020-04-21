import Transform, { Constructor } from "./Transform";
import { TransformSet } from "./TransformSet";

export default class TransformConfig<T> {
    transform: Transform;
    transformSetHash: {
        [index: string]: TransformSet<T>;
    } = {};
    types: {
        [index: string]: Constructor<any>;
    } = {};

    constructor(transform?: Transform) {
        this.transform = transform;
    }

    setTransform(transform: Transform) {
        this.transform = transform;
    }

    setType<U extends keyof T>(key: U, type: Constructor<T[U]>) {
        this.types[key as any] = type;
    }

    getType<U extends keyof T>(key: U) {
        return this.types[key as any] as Constructor<T[U]>;
    }

    register(transformSetName: string, key: keyof T, to: Constructor<any>) {
        if (!this.transformSetHash[transformSetName]) {
            this.transformSetHash[transformSetName] = new TransformSet();
        }
        this.transformSetHash[transformSetName].register(key, to);
    }

    to<U extends keyof T, V = any>(transformSetName: string, key: U, value: T[U]): V {
        let transformSet = this.transformSetHash[transformSetName];
        if (!transformSet) {
            // TODO: Should we cast?
            return value as any;
        } else {
            return transformSet.to(this.transform, key, value);
        }
    }

    from<U extends keyof T, V>(transformSetName: string, key: U, value: V, to?: Constructor<T[U]>): T[U] {
        let transformSet = this.transformSetHash[transformSetName];
        if (!transformSet) {
            // TODO: Should we cast?
            return value as any;
        } else {
            let type = to || this.getType(key);
            return transformSet.from(this.transform, key, value, type);
        }
    }

    static merge(destination: TransformConfig<any>, source: TransformConfig<any>) {
        destination.transform = source.transform;
        Object.keys(source.transformSetHash).forEach(transformSetName => {
            let destinationTransformSet = destination.transformSetHash[transformSetName];
            let sourceTransformSet = source.transformSetHash[transformSetName];
            if (!destinationTransformSet) {
                destination.transformSetHash[transformSetName] = sourceTransformSet;
            } else {
                TransformSet.merge(destinationTransformSet, sourceTransformSet);
            }
        });
        Object.keys(source.types).forEach(typeName => {
            destination.types[typeName] = source.types[typeName];
        });
    }


    static mergeAll(transformConfigs: TransformConfig<any>[]) {
        let desination = new TransformConfig();
        transformConfigs.forEach(transformConfig => {
            TransformConfig.merge(desination, transformConfig);
        });
        return desination;
    }
}