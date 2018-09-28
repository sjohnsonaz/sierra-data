function index(fields: Object, options?: {
    expires?: string;
    [other: string]: any;
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        //descriptor.enumerable = value;
    };
}