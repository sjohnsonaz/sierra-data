import * as mongoose from 'mongoose';

import { IData } from './IData';

export interface IQueryResult<T extends IData> {
    count: number;
    results: T[];
}