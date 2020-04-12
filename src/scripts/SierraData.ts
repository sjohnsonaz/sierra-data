/// <reference types="bson" />
export { Binary, DBRef, Decimal128, Double, Long, MaxKey, MinKey, ObjectId, Timestamp } from 'bson';

export { IClientData, IServerData, IData } from './interfaces/IData';
export { IQuery } from './interfaces/IQuery';
export { IQueryResult } from './interfaces/IQueryResult';
export { default as Collection } from './collection/Collection';
export { default as CollectionFactory } from './collection/CollectionFactory';
export { prop } from './decorators/Decorators';
export { default as Model } from './model/Model';
export { default as ModelDefinition, IPropertyConfig } from './model/ModelDefinition';
export { default as Service } from './implementations/Service';