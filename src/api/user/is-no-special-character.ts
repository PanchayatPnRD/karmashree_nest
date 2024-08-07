import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNoSpecialCharacterConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const regex = /^[a-zA-Z0-9]*$/;
    return typeof value === 'string' && regex.test(value);
  }

  defaultMessage() {
    return 'String ($value) contains special characters!';
  }
}

export function IsNoSpecialCharacter(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNoSpecialCharacterConstraint,
    });
  };
}
