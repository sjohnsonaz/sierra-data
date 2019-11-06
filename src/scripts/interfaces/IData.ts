import * as MongoDB from 'mongodb';

export interface IClientData {
    _id: string;
}

export interface IServerData {
    _id: MongoDB.ObjectId;
}

export type IData<T extends IClientData> = Omit<T, '_id'> & IServerData;
