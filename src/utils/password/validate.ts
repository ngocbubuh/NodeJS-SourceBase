import { plainToInstance } from "class-transformer";
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    validateOrReject
} from 'class-validator';

export async function validate<T extends object>(
    cls: new () => T,
    data: object
): Promise<void> {
    data = plainToInstance(cls, data);
    await validateOrReject(data);
}

export function Match(
    property: string,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must match ${relatedPropertyName}`;
                },
            },
        });
    };
}