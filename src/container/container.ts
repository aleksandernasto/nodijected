import {IInjectable, IInjectableServiceProvider} from "../utils/interfaces";
import {Class} from "../utils/types";

class Container {

    private static providers: IInjectableServiceProvider[] = [];

    private static instantiateService(provider: IInjectableServiceProvider) {
        const resolvedDependencies: IInjectable[] = [];

        if (provider.dependencies !== undefined) {
            provider.dependencies.forEach((dependency) => resolvedDependencies.push(this.resolve(dependency)));
        }

        return new provider.service(...(provider.constructorParams ?? []), ...resolvedDependencies);
    }

    private static findProvider<T>(service: Class<T>): IInjectableServiceProvider | undefined {
        return this.providers.find((provider) => provider.service.name === service.name);
    }

    private static isProviderAlreadyRegistered<T>(service: Class<T>): boolean {
        return this.providers.findIndex((provider) => provider.service.name === service.name) !== -1;
    }

    private static addProvider(provider: IInjectableServiceProvider): void {
        if (this.isProviderAlreadyRegistered(provider.service)) {
            return;
        }

        this.providers.push(provider);
    }

    public static registerProviders(providers: IInjectableServiceProvider[]): void {
        providers.forEach(this.addProvider.bind(this));
    }

    public static resolve<T>(service: Class<T>): T {
        const provider = this.findProvider(service);

        if (provider === undefined) {
            throw Error("requested dependency to be resolved is not registered in any provider!");
        }

        if (provider.instance === undefined) {
            provider.instance = this.instantiateService(provider);
        }

        if (!provider.asSingleton) {
            if (provider.isConsumed) {
                provider.instance = this.instantiateService(provider);
            } else {
                provider.isConsumed = true;
            }
        }

        return provider.instance as T;
    }
}

export { Container };
