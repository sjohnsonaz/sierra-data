import { Controller, IMiddleware } from 'sierra';
import Gateway from './Gateway';

export default class Service<T, U extends IMiddleware, V extends Gateway<any>> extends Controller<T, U> {
    gateway: V;
    constructor(base: string, gateway: V) {
        super(base);
        this.gateway = gateway;
    }
}
