import Model from '../implementations/Model';

export interface IQueryResult<T extends Model<any>> {
    count: number;
    results: T[];
}