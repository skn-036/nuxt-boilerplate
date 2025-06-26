import { isValid, parse } from 'date-fns';
import { string, ValidationError } from 'yup';

import type { InferType, Schema, TestContext } from 'yup';

export type YupValidationError = Record<string, string | undefined>;
export type YupValidationResult<T> =
  | {
      validated: true;
      data: T;
      errors?: never;
    }
  | {
      validated: false;
      data?: never;
      errors: YupValidationError;
    };

export const validateData = async <S extends Schema>(
  schema: S,
  value: any,
): Promise<YupValidationResult<InferType<S>>> => {
  try {
    const data = await schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    return {
      validated: true,
      data,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        validated: false,
        errors: error.inner.reduce((prev, err, index) => {
          const { path, message } = err;
          if (!message) return prev;
          return { ...prev, [path ? path : index]: message };
        }, {}),
      };
    }
    return {
      validated: false,
      errors: {},
    };
  }
};

export const requiredIfExists = (
  value: any,
  { createError, path }: TestContext,
) => {
  if (value === undefined) return true;
  if (!value) return createError({ message: `${path} is required` });
  return true;
};

export const isValidDate = (skipUndefined: boolean = false) => {
  return (value: any, { createError, path }: TestContext) => {
    if (skipUndefined && value === undefined) return true;
    const date = new Date(value);

    if (!isValid(date)) {
      return createError({ message: `${path} is not valid date` });
    }
    return true;
  };
};

export const validateDateWithFormat = (dateFormat: string) => {
  return (value: any, { createError, path }: TestContext) => {
    const date = parse(value, dateFormat, new Date());
    if (!isValid(date)) {
      return createError({
        message: `${path} is not valid date of format ${dateFormat}`,
      });
    }
    return true;
  };
};

export const resolvePasswordSchema = () => {
  let passwordSchema = string();
  if (process.env.NODE_ENV === 'production') {
    passwordSchema = passwordSchema.test((value, { createError }) => {
      if (!value) return true;

      if (value?.length < 8)
        return createError({
          message: 'Password must be at least 8 characters',
        });
      if (!/[a-z]/.test(value))
        return createError({
          message: 'Password must have at least one lowercase char',
        });
      if (!/[A-Z]/.test(value))
        return createError({
          message: 'Password must have at least one uppercase char',
        });
      if (!/[0-9]+/.test(value))
        return createError({
          message: 'Password must have at least one number',
        });
      if (!/[^a-zA-Z0-9\s]+/.test(value))
        return createError({
          message: 'Password must have at least one special char (@,!,#, etc).',
        });

      return true;
    });
  }

  return passwordSchema;
};
