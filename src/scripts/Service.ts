import { Controller } from 'sierra';
import Gateway from './Gateway';

export default class Service<T, U, V extends Gateway<any>> extends Controller<T, U> {
    gateway: V;
    constructor(base: string, gateway: V) {
        super(base);
        this.gateway = gateway;
    }
}
