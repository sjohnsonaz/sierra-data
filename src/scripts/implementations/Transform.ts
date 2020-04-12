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

export interface ITransformHandler<T, U> {
    from: Constructor<T>;
    to: Constructor<U>;
    fromTransform: (value: T) => U;
    toTransform?: (value: U) => T;
}

export class TransformRegistry {
    private fromHash: TransformHash = {};

    private registerSymbol<T, U>(from: Symbol, to: Symbol, transform: (value: T) => U) {
        let toHash = this.fromHash[from as any];
        if (!toHash) {
            toHash = {};
            this.fromHash[from as any] = toHash;
        }
        toHash[to as any] = transform;
    }

    register<T, U>(from: Constructor<T>, to: Constructor<U>, fromTransform: (value: T) => U, toTransform?: (value: U) => T) {
        let fromSymbol = getID(from);
        let toSymbol = getID(to);
        this.registerSymbol(fromSymbol, toSymbol, fromTransform);
        if (toTransform) {
            this.registerSymbol(toSymbol, fromSymbol, toTransform);
        }
    }

    registerHandler<T, U>(transformHandler: ITransformHandler<T, U>) {
        this.register(
            transformHandler.from,
            transformHandler.to,
            transformHandler.fromTransform,
            transformHandler.toTransform
        );
    }

    run<T, U>(value: T, from: Constructor<T>, to: Constructor<U>): U {
        let fromSymbol = getID(from);
        let toSymbol = getID(to);
        if (fromSymbol === toSymbol) {
            return value as any;
        }
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

    private getConstructor<T>(value: T): Constructor<T> {
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

    convert<T, U>(value: T, to: Constructor<U>): U {
        let from = this.getConstructor(value);
        return this.run(value, from, to);
    }
}

interface JsonObject {
    [index: string]: number | string | JsonObject;
}