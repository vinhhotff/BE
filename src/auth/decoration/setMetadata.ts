/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// Key để lưu trữ metadata
export const MESSAGE_KEY = 'custom_message';

// Decorator để gán message
export const CustomMessage = (message: string) =>
  SetMetadata(MESSAGE_KEY, message);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);


export const PERMISSION_KEY = 'permissions';
export const Permission = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);

export function IsOnlyOneDefined(
  properties: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOnlyOneDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as Record<string, any>;
          const definedCount = properties.filter(
            (prop) => obj[prop] !== undefined
          ).length;
          return definedCount === 1;
        },
      },
    });
  };
}