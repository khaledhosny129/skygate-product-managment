import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: {
        ...validationOptions,
        message: `${propertyName} is not a valid ObjectId`
      },
      validator: {
        validate(value: string | Types.ObjectId) {
          return Types.ObjectId.isValid(value);
        }
      }
    });
  };
}
