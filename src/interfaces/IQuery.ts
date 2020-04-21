export type IQuery<T> = {
    [P in keyof T]?: T[P] | Partial<IQuerySelector<T[P]>>;
}

export type TypeAlias = 'double' |
    'string' |
    'object' |
    'array' |
    'binData' |
    'undefined' |
    'objectId' |
    'bool' |
    'date' |
    'null' |
    'regex' |
    'dbPointer' |
    'javascript' |
    'symbol' |
    'javascriptWithScope' |
    'int' |
    'timestamp' |
    'long' |
    'decimal' |
    'minKey' |
    'maxKey';

export interface IQuerySelector<T> {
    $eq: T;
    $gt: T;
    $gte: T;
    $in: T[];
    $lt: T;
    $lte: T;
    $ne: T;
    $nin: T[];
    $and: IQuerySelector<T>[];
    $not: IQuerySelector<T>[];
    $nor: IQuerySelector<T>[];
    $or: IQuerySelector<T>[];
    $exists: boolean;
    $type: TypeAlias | TypeAlias[];
    $expr: any;
    $jsonSchema: any;
    $mod: number[];
    $regex: RegExp;
    $text: string;
    $where: any;
    $geoIntersects: any;
    $geoWithin: any;
    $near: any;
    $nearSphere: any;
    $all: T[];
    $elemMatch: any;
    $size: number;
    $bitsAllClear: any;
    $bitsAllSet: any;
    $bitsAnyClear: any;
    $bitsAnySet: any;
    $comment: string;
    //$: any;
    //$elemMatch: any;
    //$meta: any;
    //$slice: any;
}