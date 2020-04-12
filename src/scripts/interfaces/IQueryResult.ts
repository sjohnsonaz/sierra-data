import Model from '../model/Model';

export interface IQueryResult<T extends Model<any>> {
    count: number;
    results: T[];
}