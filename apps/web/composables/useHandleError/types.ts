import type { ApiError } from '@plentymarkets/shop-api';
import type { NuxtError } from 'nuxt/app';

export type ErrorParams = {
  /** The error message. */
  message: string;
  /** The HTTP status code associated with this error. */
  statusCode?: number;
  /** An optional cause for the error, providing more context or the underlying error that led to this error. */
  cause?: unknown;
};

export type UseHandleError = (error: ApiError | NuxtError<unknown> | null) => void;
