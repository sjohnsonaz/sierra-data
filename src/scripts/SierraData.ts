/// <reference types="bson" />
export { Binary, DBRef, Decimal128, Double, Long, MaxKey, MinKey, ObjectId, Timestamp } from 'bson';

export { IClientData } from './interfaces/IClientData';
export { IServerData } from './interfaces/IServerData';
export { IQuery } from './interfaces/IQuery';
export { IQueryResult } from './interfaces/IQueryResult';
export { default as Collection } from './implementations/Collection';
export { default as CollectionFactory } from './implementations/CollectionFactory';
export { prop } from './implementations/Decorators';
export { default as Model } from './implementations/Model';
export { default as ModelDefinition, IPropertyConfig } from './implementations/ModelDefinition';
export { default as Service } from './implementations/Service';