/// <reference types="bson" />
export { Binary, DBRef, Decimal128, Double, Long, MaxKey, MinKey, ObjectID, ObjectId, Timestamp } from 'bson';

export { IData } from './interfaces/IData';
export { IQuery } from './interfaces/IQuery';
export { IQueryResult } from './interfaces/IQueryResult';
export { default as Collection } from './implementations/Collection';
export { default as CollectionFactory } from './implementations/CollectionFactory';
export { prop } from './implementations/Decorators';
export { default as Model } from './implementations/Model';
export { default as ModelDefinition, IAllPropertyConfig, INumberPropertyConfig, IPropertyConfig, IStringPropertyConfig } from './implementations/ModelDefinition';
export { default as Service } from './implementations/Service';