export type TransformHash = {
    [index: string]: {
        [index: string]: (value: any) => any;
    };
};

export interface NewConstructor<T> {
    new(...params: any[]): T;
}

export interface FactoryConstructor<T> {
    (...params: any[]): T;
}
export type Constructor<T> = NewConstructor<T> | FactoryConstructor<T>;

function getID(constructor: Constructor<any>) {
    if (constructor.name) {
        return Symbol.for(constructor.name);
    }
    if (!constructor['_transformID']) {
        constructor['_transformID'] = Symbol.for((Math.floor(Math.random() * 1000) + Date.now()).toString());
    }
    return constructor['_transformID'] as Symbol;
}

export class TransformRegistry {
    fromHash: TransformHash = {};
    register<T, U>(from: Constructor<T>, to: Constructor<U>, transform: (value: T) => U) {
        let fromSymbol = getID(from);
        let toSymbol = getID(to);
        let toHash = this.fromHash[fromSymbol as any];
        if (!toHash) {
            toHash = {};
            this.fromHash[fromSymbol as any] = toHash;
        }
        toHash[toSymbol as any] = transform;
    }
    run<T, U>(from: Constructor<T>, to: Constructor<U>, value: T): U {
        let fromSymbol = getID(from);
        let toSymbol = getID(to);
        let toHash = this.fromHash[fromSymbol as any];
        if (!toHash) {
            throw `No transform available for ${from} to ${to}`;
        } else {
            let transform = toHash[toSymbol as any];
            if (!transform) {
                throw `No transform available for ${from} to ${to}`;
            } else {
                return transform(value);
            }
        }
    }
    convert<T, U>(value: T, to: Constructor<U>): U {
        let from = this.getConstructor(value);
        return this.run(from, to, value);
    }
    getConstructor<T>(value: T): Constructor<T> {
        let type = typeof value;
        switch (type) {
            case 'boolean':
                return Boolean as any;
            case 'number':
                return Number as any;
            case 'string':
                return String as any;
            case 'object':
                if (value === null) {
                    return undefined;
                }
                return value.constructor as any;
            case 'function':
                return Function as any;
            case 'bigint':
                return BigInt as any;
            // case 'undefined':
            // case 'symbol':
            default:
                return undefined;
        }
    }
}

interface JsonObject {
    [index: string]: number | string | JsonObject;
}