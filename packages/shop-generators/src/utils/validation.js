import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Validation utilities for PlentyONE Shop generators
 */

/**
 * Validates if a component name follows PascalCase convention
 */
export function validateComponentName(name) {
  if (!name || typeof name !== 'string') {
    return 'Component name is required';
  }
  
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Component name must be in PascalCase (e.g., ProductCard)';
  }
  
  return true;
}

/**
 * Validates if a composable name follows camelCase with 'use' prefix
 */
export function validateComposableName(name) {
  if (!name || typeof name !== 'string') {
    return 'Composable name is required';
  }
  
  if (!/^use[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Composable name must start with "use" and be in camelCase (e.g., useProductCart)';
  }
  
  return true;
}

/**
 * Validates if a file or directory already exists at the given path
 */
export function validateFileExists(basePath, relativePath) {
  const fullPath = join(basePath, relativePath);
  
  if (existsSync(fullPath)) {
    return `File or directory already exists at: ${relativePath}`;
  }
  
  return true;
}

/**
 * Validates if a string is not empty and contains only valid characters
 */
export function validateNotEmpty(value) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return 'This field is required';
  }
  
  return true;
}

/**
 * Creates a generic path validator for different component types
 */
export function createPathValidator(basePath, componentType) {
  return function(name) {
    // First validate the name format
    const nameValidation = componentType === 'component' 
      ? validateComponentName(name)
      : validateComposableName(name);
    
    if (nameValidation !== true) {
      return nameValidation;
    }
    
    // Then check if the path already exists
    const relativePath = componentType === 'component' 
      ? `apps/web/components/${name}`
      : `apps/web/composables/${name}`;
    
    return validateFileExists(basePath, relativePath);
  };
}

/**
 * Validates page name (kebab-case for URL-friendly names)
 */
export function validatePageName(name) {
  if (!name || typeof name !== 'string') {
    return 'Page name is required';
  }
  
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && !/^[a-z]$/.test(name)) {
    return 'Page name must be in kebab-case (e.g., product-details)';
  }
  
  return true;
}
