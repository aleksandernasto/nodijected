import {Class} from "./types";

export interface IInjectable {}

export interface IInjectableServiceProvider {
    service: Class<IInjectable>;
    dependencies?: Array<Class<IInjectable>>;
    constructorParams?: any[];
    asSingleton?: boolean;
    instance?: IInjectable;
    isConsumed?: boolean;
}
