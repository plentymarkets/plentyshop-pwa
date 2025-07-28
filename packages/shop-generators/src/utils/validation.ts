import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { RESERVED_WORDS, VUE_RESERVED_NAMES, HTML_ELEMENTS, RESERVED_ROUTES } from './validation-constants';
import type { GeneratorInputAnswers } from '../types/validation';

/**
 * Validation utilities for PlentyONE Shop generators
 */

/**
 * Validates if a component name follows PascalCase convention
 */
export function validateComponentName(name: unknown): string | true {
  if (!name || typeof name !== 'string') {
    return 'Component name is required';
  }

  // Check length
  if (name.length < 2) {
    return 'Component name must be at least 2 characters long';
  }

  if (name.length > 50) {
    return 'Component name should not exceed 50 characters';
  }

  // Check PascalCase format
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Component name must be in PascalCase (e.g., ProductCard)';
  }

  // Check for reserved words
  if (RESERVED_WORDS.includes(name.toLowerCase())) {
    return `"${name}" is a reserved word and cannot be used as a component name`;
  }

  // Check for Vue reserved names
  if (VUE_RESERVED_NAMES.includes(name)) {
    return `"${name}" is reserved by Vue and cannot be used as a component name`;
  }

  // Check for HTML element names
  if (HTML_ELEMENTS.includes(name.toLowerCase())) {
    return `"${name}" conflicts with HTML element names. Consider a more specific name like "${name}Component"`;
  }

  // Check for consecutive numbers (usually indicates poor naming)
  if (/\d{2,}/.test(name)) {
    return 'Component names should not contain consecutive numbers. Use descriptive names instead.';
  }

  return true;
}

/**
 * Validates if a composable name follows camelCase with 'use' prefix
 */
export function validateComposableName(name: unknown): string | true {
  if (!name || typeof name !== 'string') {
    return 'Composable name is required';
  }

  // Check length
  if (name.length < 4) {
    return 'Composable name must be at least 4 characters long (including "use" prefix)';
  }

  if (name.length > 50) {
    return 'Composable name should not exceed 50 characters';
  }

  // Check format
  if (!/^use[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Composable name must start with "use" and be in camelCase (e.g., useProductCart)';
  }

  // Extract the main part (without "use")
  const mainPart = name.slice(3);

  // Check for reserved words in the main part
  if (RESERVED_WORDS.includes(mainPart.toLowerCase())) {
    return `"${mainPart}" is a reserved word and cannot be used in composable names`;
  }

  // Check for consecutive numbers
  if (/\d{2,}/.test(mainPart)) {
    return 'Composable names should not contain consecutive numbers. Use descriptive names instead.';
  }

  return true;
}

/**
 * Validates if a file or directory already exists at the given path
 */
export function validateFileExists(basePath: string, relativePath: string): string | true {
  const fullPath = join(basePath, relativePath);

  if (existsSync(fullPath)) {
    return `File or directory already exists at: ${relativePath}`;
  }

  return true;
}

/**
 * Validates if a string is not empty and contains only valid characters
 */
export function validateNotEmpty(value: unknown): string | true {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return 'This field is required';
  }

  return true;
}

/**
 * Validates if a description is appropriate
 */
export function validateDescription(description: unknown): string | true {
  if (!description || typeof description !== 'string') {
    return true; // Description is optional
  }

  if (description.length < 10) {
    return 'Description should be at least 10 characters long to be meaningful';
  }

  if (description.length > 200) {
    return 'Description should not exceed 200 characters';
  }

  return true;
}

/**
 * Creates a generic path validator for different component types
 */
export function createPathValidator(basePath: string, componentType: string) {
  return function (name: unknown): string | true {
    // First validate the name format
    let nameValidation: string | true;

    switch (componentType) {
      case 'component':
      case 'ui':
        nameValidation = validateComponentName(name);
        break;
      case 'composable':
        nameValidation = validateComposableName(name);
        break;
      case 'page':
        nameValidation = validatePageName(name);
        break;
      default:
        nameValidation = validateNotEmpty(name);
    }

    if (nameValidation !== true) {
      return nameValidation;
    }

    // Then check if the path already exists
    let relativePath;
    switch (componentType) {
      case 'component':
        relativePath = `apps/web/components/${name}`;
        break;
      case 'composable':
        relativePath = `apps/web/composables/${name}`;
        break;
      case 'ui':
        relativePath = `apps/web/components/ui/${name}`;
        break;
      case 'page':
        relativePath = `apps/web/pages/${name}.vue`;
        break;
      default:
        return true;
    }

    return validateFileExists(basePath, relativePath);
  };
}

/**
 * Validates page name (kebab-case for URL-friendly names)
 */
export function validatePageName(name: unknown): string | true {
  if (!name || typeof name !== 'string') {
    return 'Page name is required';
  }

  if (name.length < 2) {
    return 'Page name must be at least 2 characters long';
  }

  if (name.length > 50) {
    return 'Page name should not exceed 50 characters';
  }

  // Allow single lowercase letter or kebab-case
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && !/^[a-z]$/.test(name)) {
    return 'Page name must be in kebab-case (e.g., product-details)';
  }

  // Check for reserved route names
  if (RESERVED_ROUTES.includes(name)) {
    return `"${name}" is a reserved route name and cannot be used`;
  }

  // Check for consecutive hyphens
  if (/--/.test(name)) {
    return 'Page names should not contain consecutive hyphens';
  }

  return true;
}

/**
 * Validates settings category name
 */
export function validateSettingsCategory(category: unknown): string | true {
  if (!category || typeof category !== 'string') {
    return 'Settings category is required';
  }

  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(category) && !/^[a-z]$/.test(category)) {
    return 'Settings category must be in kebab-case (e.g., shop-settings)';
  }

  return true;
}

/**
 * Validates name based on generator type
 */
function validateNameByType(name: unknown, generatorType: string): string | null {
  if (!name) return null;

  switch (generatorType) {
    case 'component': {
      const componentValidation = validateComponentName(name);
      return componentValidation !== true ? componentValidation : null;
    }

    case 'composable': {
      const composableValidation = validateComposableName(name);
      return composableValidation !== true ? composableValidation : null;
    }

    case 'page': {
      const pageValidation = validatePageName(name);
      return pageValidation !== true ? pageValidation : null;
    }

    default:
      return null;
  }
}

/**
 * Comprehensive validation function that combines multiple checks
 */
export function validateGeneratorInput(answers: GeneratorInputAnswers, generatorType: string): string[] {
  const errors: string[] = [];

  // Validate name based on generator type
  const nameError = validateNameByType(answers.name, generatorType);
  if (nameError) {
    errors.push(nameError);
  }

  // Validate description if provided
  if (answers.description) {
    const descValidation = validateDescription(answers.description);
    if (descValidation !== true) {
      errors.push(descValidation);
    }
  }

  return errors;
}
