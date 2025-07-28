/**
 * Type definitions for project validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  message?: string;
}
