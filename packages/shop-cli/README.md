# @plentymarkets/shop-cli

Official CLI for PlentyONE Shop development - code generators, utilities, and development tools.

## Overview

This package provides a unified command-line interface for PlentyONE Shop PWA development, including code generators for creating consistent components, composables, pages, and other development utilities. It's built on top of [PlopJS](https://plopjs.com/) and follows the established patterns from the PlentyONE Shop PWA.

## Installation

```bash
# In your PlentyONE Shop PWA project
npm install @plentymarkets/shop-cli

# Or run directly with npx
npx @plentymarkets/shop-cli
```

## Quick Start

```bash
# Initialize CLI and see available commands
npx plentyshop init

# Generate code interactively
npx plentyshop generate

# Generate specific types
npx plentyshop generate component
npx plentyshop generate ui-component
npx plentyshop generate composable

# Get help
npx plentyshop --help
```

## Available Generators

### ✅ Production Ready

- **component** - Generate Vue 3 components with TypeScript, tests, and proper structure
- **ui-component** - Generate reusable UI components following Storefront UI patterns
- **composable** - Generate Vue 3 composables with TypeScript, tests, and index files

### 🚧 Planned (Future Releases)

- **settings** - Generate settings components for admin configuration
- **page** - Generate Nuxt.js pages with routing and layout support
- **block** - Generate CMS-like content blocks for dynamic content

## Architecture Overview

The CLI is built using a modular architecture with the following core concepts:

### Core Modules

```
src/core/
├── builders/           # Fluent API for building PlopJS actions
├── error-handling/     # Centralized error handling system
├── generators/         # Base generator classes and utilities
├── path/              # Path resolution with strategy pattern
└── plugins/           # Helper plugin system for Handlebars
```

### Key Components

- **BaseGenerator** - Abstract base class for all generators with validation and error handling
- **ActionBuilder** - Fluent API for building file generation actions
- **PathResolver** - Strategy-based path resolution for different generator types
- **ErrorHandler** - Centralized error handling with user-friendly messages
- **HelperPluginSystem** - Modular system for Handlebars helpers

## Adding New Generators

Follow these steps to add a new generator to the CLI:

### Step 1: Create Generator Files

Create a new directory under `src/generators/[generator-name]/`:

```bash
mkdir src/generators/my-generator
```

Create the required files:

```
src/generators/my-generator/
├── index.ts                    # Export the generator
├── my-generator.ts            # Main generator implementation
└── my-generator-prompts.ts    # Prompt definitions
```

### Step 2: Implement the Generator

**my-generator-prompts.ts:**
```typescript
import type { GeneratorPrompt } from '../../core';

export const myGeneratorPrompts: GeneratorPrompt[] = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of your component?',
    validate: (input: string) => {
      // Add validation logic
      return input.length > 0 || 'Name is required';
    },
  },
  // Add more prompts as needed
];
```

**my-generator.ts:**
```typescript
import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../../core';
import { myGeneratorPrompts } from './my-generator-prompts';
import { validateMyGeneratorName } from '../../utils/validation';

class MyGenerator extends BaseGenerator {
  readonly name = 'my-generator';
  readonly description = 'Generate a new custom component';

  getPrompts(): GeneratorPrompt[] {
    return myGeneratorPrompts;
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('my-generator', data.name)
      .withData(data)
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  validateInput(data: PromptAnswers): void {
    validateMyGeneratorName(data.name);
  }
}

export default function myGenerator(plop: NodePlopAPI): void {
  const generator = new MyGenerator();
  generator.register(plop);
}
```

**index.ts:**
```typescript
export { default } from './my-generator';
```

### Step 3: Create Templates

Create template files under `templates/my-generator/`:

```
templates/my-generator/
├── my-generator.vue.hbs      # Main template
├── types.ts.hbs             # TypeScript types
└── my-generator.spec.ts.hbs # Test template
```

Example template (`my-generator.vue.hbs`):
```handlebars
<template>
  <div class="{{kebabCase name}}">
    <!-- Component content -->
  </div>
</template>

<script setup lang="ts">
import type { {{pascalCase name}}Props } from './types';

defineProps<{{pascalCase name}}Props>();
</script>
```

### Step 4: Add Path Strategy

Add a path strategy in `src/core/path/PathStrategies.ts`:

```typescript
export class MyGeneratorPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const basePath = join(this.config.webAppRoot, 'my-generators', name);
    // ... implement path logic
  }
}
```

Register it in `PathResolver.ts`:
```typescript
private registerDefaultStrategies(): void {
  // ... existing strategies
  this.strategies.set('my-generator', new MyGeneratorPathStrategy(this.config));
}
```

### Step 5: Add Validation

Add validation logic in `src/utils/validation.ts`:

```typescript
export function validateMyGeneratorName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Generator name is required');
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Generator name must be alphanumeric');
  }
}
```

### Step 6: Register the Generator

Add your generator to `src/generators/index.ts`:

```typescript
import myGenerator from './my-generator';

export default function (plop: NodePlopAPI): void {
  // ... existing generators
  
  // Load my generator
  myGenerator(plop);
  console.log('🎯 My Generator loaded successfully!');
}
```

### Step 7: Update CLI Help

Update `bin/plentyshop.js` to include your generator in the help text:

```javascript
Available generators:
  - my-generator    Generate a new custom component
  - component       Generate a new Vue component
  // ... other generators
```

### Step 8: Add Tests

Create comprehensive tests under `__tests__/generators/my-generator/`:

```
__tests__/generators/my-generator/
├── my-generator.test.ts       # Unit tests
├── integration.test.ts        # Integration tests
└── __snapshots__/            # Snapshot tests
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run type-check
```

### Code Quality

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format:fix
```

### Testing Your Generator

```bash
# Test generation in the CLI package
cd packages/shop-cli
npm run generate my-generator

# Test in the actual web app
cd ../../apps/web
npx plentyshop generate my-generator
```

## File Structure Conventions

### Generator Structure
- Each generator lives in `src/generators/[name]/`
- Main implementation in `[name].ts`
- Prompts in `[name]-prompts.ts`
- Export in `index.ts`

### Template Structure
- Templates in `templates/[generator-name]/`
- Use `.hbs` extension for Handlebars templates
- Follow naming: `[main-file].hbs`, `types.ts.hbs`, `[name].spec.ts.hbs`

### Test Structure
- Tests in `__tests__/generators/[name]/`
- Unit tests for generator logic
- Integration tests for file generation
- Snapshot tests for output validation

## Best Practices

### Generator Design
1. **Extend BaseGenerator** - Use the base class for consistency
2. **Validate Input** - Implement proper validation in `validateInput()`
3. **Error Handling** - Use the built-in error handling system
4. **Naming Conventions** - Follow PlentyONE naming patterns

### Template Design
1. **Use Partials** - Reuse common template parts
2. **Handlebars Helpers** - Leverage case conversion helpers
3. **Conditional Content** - Use `{{#if}}` for optional features
4. **Type Safety** - Generate proper TypeScript interfaces

### Testing
1. **Unit Tests** - Test generator logic in isolation
2. **Integration Tests** - Test actual file generation
3. **Snapshot Tests** - Verify generated file content
4. **Edge Cases** - Test validation and error scenarios

## Contributing

This package is part of the PlentyONE Shop PWA monorepo. Please follow the established patterns:

1. Follow the existing code style and conventions
2. Add comprehensive tests for new features
3. Update documentation when adding new generators
4. Ensure TypeScript types are properly defined

## Troubleshooting

### Common Issues

**Generator not found**
- Ensure the generator is registered in `src/generators/index.ts`
- Check that the generator exports are correct

**Template errors**
- Verify template syntax and helper usage
- Check that required data is passed to templates

**Path resolution issues**
- Ensure path strategies are properly configured
- Verify the generator type is registered in PathResolver

### Debug Mode

Enable verbose logging:
```bash
DEBUG=plop:* npx plentyshop generate
```

## License

BSD-3-Clause
