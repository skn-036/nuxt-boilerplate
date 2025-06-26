import type { StatusCodes } from 'http-status-codes';

/**
 * error code description
 * 13330: middleware errors on the app level, like cors error, not authorized on the app level etc
 * 13331: User is not authenticated and access token is not valid or provided
 * 13332: User is authenticated but not authorized to access the resource
 * 13333: Showable error message to frontend. it may used on the reusable frontend request method to show toast without repeating
 * 13334: Showable error message in sense of success. for example, a user is authenticated and trying to login again. User is already login, this type of message will be coded with 13334
 * 13335: validation error. for this type of error, validationErrors will be provided as a key value pair
 * 13336: unknown error
 * 13337: unknown error
 * 0: code doesn't has any value
 */

export enum ErrorCodes {
  MIDDLEWARE_ERROR = 13330,
  UNAUTHENTICATED = 13331,
  UNAUTHORIZED = 13332,
  SHOWABLE_ERROR = 13333,
  SHOWABLE_SUCCESS = 13334,
  VALIDATION_ERROR = 13335,
  UNKNOWN_ERROR_A = 13336,
  UNKNOWN_ERROR_B = 13337,
  NO_CODE = 0,
}

export type AppError = {
  message: string;
  title: string;
  code: ErrorCodes;
  status: StatusCodes;
  reason?: string;
  validationErrors?: Record<string, string>;
  key?: string;
};

export type RequestOptions = {
  toast?: boolean;
};

export type ClientRequestOptions<T> = RequestOptions & {
  defaultReturnValue?: T | null;
};
