export type TransformHash = {
    [index: string]: {
        [index: string]: (value: any) => any;
    };
};

export type Constructor<T> = new (...params: any[]) => T;

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
    run(from: any, to: any, value: any) {
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
}

let transformRegistry = new TransformRegistry();

function StringNumber(value: string) {
    return Number(value);
}
transformRegistry.register(String, Number, StringNumber);
transformRegistry.run(String, Number, '1234');