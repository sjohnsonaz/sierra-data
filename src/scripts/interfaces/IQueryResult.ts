import { IData } from './IData';
import Model from '../implementations/Model';

export interface IQueryResult<T extends IData> {
    count: number;
    results: Model<T>[];
}