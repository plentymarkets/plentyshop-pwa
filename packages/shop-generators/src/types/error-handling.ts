/**
 * Type definitions for error handling utilities
 */

export interface ErrorDetails {
  [key: string]: any;
}

export type UserFriendlyMessageKey = 
  | 'componentExists'
  | 'invalidComponentName'
  | 'invalidComposableName'
  | 'projectNotFound'
  | 'noWritePermission';
