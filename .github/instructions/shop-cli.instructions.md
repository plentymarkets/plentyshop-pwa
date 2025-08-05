---
applyTo: 'packages/shop-cli/'
---

# PlentyONE Shop CLI - AI Agent Developer Instructions

## Package Overview

The `@plentymarkets/shop-cli` package provides code generators for PlentyONE Shop PWA development. It's built on PlopJS and follows a modular, extensible architecture designed for maintainability and consistency.

## Architecture Deep Dive

### Core Module Structure

```
src/core/
├── builders/           # ActionBuilder - Fluent API for PlopJS actions
├── error-handling/     # Centralized error handling system
├── generators/         # BaseGenerator abstract class and utilities
├── path/              # PathResolver with strategy pattern
└── plugins/           # HelperPluginSystem for Handlebars helpers
```

#### Key Design Patterns

1. **Strategy Pattern** - PathResolver uses strategies for different generator types
2. **Factory Pattern** - BaseGenerator provides consistent generator structure
3. **Builder Pattern** - ActionBuilder creates PlopJS actions fluently
4. **Plugin Pattern** - HelperPluginSystem for modular Handlebars helpers

### Critical Components

#### BaseGenerator (src/core/generators/BaseGenerator.ts)

Abstract base class that all generators must extend:

```typescript
export abstract class BaseGenerator {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract getPrompts(): GeneratorPrompt[];
  abstract createActions(data: PromptAnswers): GeneratorAction[];
  abstract validateInput(data: PromptAnswers): void;

  register(plop: NodePlopAPI): void {
    /* Registration logic */
  }
}
```

**Why this matters**: Ensures all generators follow the same pattern, provides consistent error handling, and enforces validation.

#### ActionBuilder (src/core/builders/ActionBuilder.ts)

Fluent API for building PlopJS actions:

```typescript
// Instead of manually building action arrays
ActionBuilder.forGenerator('component', name).withData(data).addMainFile().addTypes().addTests().build();

// Presets for common patterns
ActionBuilderPresets.vueComponent(name, data);
```

**Why this matters**: Eliminates duplication, reduces errors, and provides consistent file structures.

#### PathResolver (src/core/path/PathResolver.ts)

Strategy-based path resolution:

```typescript
export class PathResolver {
  private readonly strategies = new Map<string, PathStrategy>();

  resolve(type: string, name: string, options?: PathOptions): PathResult {
    const strategy = this.strategies.get(type);
    return strategy.resolve(name, options);
  }
}
```

**Path Strategies**: ComponentPathStrategy, ComposablePathStrategy, etc.

**Why this matters**: Centralizes path logic, makes it easy to add new generator types, and ensures consistent file placement.

#### Error Handling System (src/core/error-handling/)

Centralized error handling with user-friendly messages:

```typescript
export class ErrorHandler {
  wrapGeneratorExecution(name: string, operation: () => ActionType[], data?: PromptAnswers): ErrorResult<ActionType[]>;
  wrapValidation<T>(operation: () => T, context?: string): ErrorResult<T>;
  wrapFileSystemOperation<T>(operation: () => T, context?: string): ErrorResult<T>;
}
```

**Why this matters**: Provides consistent error messages, handles edge cases gracefully, and improves user experience.

### Generator Implementation Pattern

Every generator follows this structure:

```typescript
// 1. Prompts definition
export const generatorPrompts: GeneratorPrompt[] = [
  {
    type: 'input',
    name: 'name',
    message: 'Component name?',
    validate: validateComponentName,
  },
];

// 2. Generator class
class ComponentGenerator extends BaseGenerator {
  readonly name = 'component';
  readonly description = 'Generate a Vue component';

  getPrompts(): GeneratorPrompt[] {
    return componentPrompts;
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('component', data.name)
      .withData(data)
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  validateInput(data: PromptAnswers): void {
    validateComponentName(data.name);
  }
}

// 3. Registration function
export default function componentGenerator(plop: NodePlopAPI): void {
  const generator = new ComponentGenerator();
  generator.register(plop);
}
```

### Template System

#### Template Structure

```
templates/
├── component/          # Vue component templates
│   ├── component.vue.hbs
│   ├── types.ts.hbs
│   └── component.spec.ts.hbs
├── composable/         # Composable templates
└── partials/          # Shared template parts
    ├── jsdoc.hbs
    ├── typescript-interface.hbs
    └── export-statement.hbs
```

#### Handlebars Helpers

Custom helpers provided by the HelperPluginSystem:

- **StringCasePlugin**: `pascalCase`, `camelCase`, `kebabCase`, `snakeCase`, `constantCase`
- **ComposablePlugin**: `composableName`, `isComposableName`
- **UtilityPlugin**: `concat`, `eq`, `includes`

#### Template Partials

Reusable template fragments:

```handlebars
{{!-- Usage in templates --}}
{{> jsdoc description="Component description"}}
{{> typescript-interface name="ComponentProps" properties=props}}
{{> export-statement name="Component" hasTypes=true}}
```

### Validation System

#### Centralized Validation (src/utils/validation.ts)

```typescript
// Component naming validation
export function validateComponentName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Component name is required');
  }

  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Component name must be PascalCase');
  }
}

// Composable naming validation
export function validateComposableName(name: string): void {
  if (!name.startsWith('use')) {
    throw new Error('Composable name must start with "use"');
  }

  if (!/^use[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Composable name must be camelCase starting with "use"');
  }
}
```

#### Project Structure Validation (src/utils/project-validation.ts)

Validates that the CLI is being run in a valid PlentyONE Shop PWA project:

```typescript
export function validateProjectStructure(): ValidationResult {
  // Checks for:
  // - turbo.json (Turborepo)
  // - apps/web/ directory
  // - Nuxt.js configuration
  // - Component directories
}
```

### File Generation Workflow

1. **User Input** → Prompts collect required data
2. **Validation** → Input is validated against naming conventions
3. **Path Resolution** → PathResolver determines target locations
4. **Action Building** → ActionBuilder creates PlopJS actions
5. **Template Processing** → Handlebars processes templates with data
6. **File Generation** → PlopJS writes files to the file system
7. **Error Handling** → Any errors are caught and reported gracefully

### Testing Strategy

#### Test Structure

```
__tests__/
├── generators/         # Generator-specific tests
│   ├── component/
│   └── composable/
├── core/              # Core module tests
│   ├── builders/
│   ├── error-handling/
│   ├── generators/
│   └── path/
└── utils/             # Test utilities
    ├── cli-helpers.ts
    ├── component-helpers.ts
    ├── directory-helpers.ts
    └── snapshot-helpers.ts
```

#### Test Categories

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test complete file generation workflows
3. **Snapshot Tests**: Verify generated file content against snapshots
4. **Error Tests**: Verify error handling and validation

### Extension Points

#### Adding New Generators

1. Create generator in `src/generators/[name]/`
2. Implement BaseGenerator abstract methods
3. Add path strategy in `src/core/path/PathStrategies.ts`
4. Create templates in `templates/[name]/`
5. Add validation in `src/utils/validation.ts`
6. Register in `src/generators/index.ts`

#### Adding New Path Strategies

```typescript
export class CustomPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    // Custom path resolution logic
  }
}
```

#### Adding New Handlebars Helpers

```typescript
export class CustomHelperPlugin extends BaseHelperPlugin {
  readonly name = 'custom';
  readonly helpers = ['customHelper'];

  register(plop: NodePlopAPI): void {
    plop.setHelper('customHelper', (value) => {
      // Custom helper logic
    });
  }
}
```

### Performance Considerations

1. **Template Caching**: Templates are loaded once and cached
2. **Lazy Loading**: Generators are loaded on-demand
3. **Path Optimization**: PathResolver caches strategy instances
4. **Error Boundaries**: Error handling prevents cascading failures

### Security Considerations

1. **Input Sanitization**: All user input is validated
2. **Path Traversal Prevention**: Path resolution is constrained to project directories
3. **Template Safety**: Handlebars templates are safe by default
4. **File Overwrites**: Conflict detection prevents accidental overwrites

### Maintenance Guidelines

#### Code Organization

- Keep generators focused and single-purpose
- Use composition over inheritance where possible
- Maintain clear separation between core and generator logic
- Follow TypeScript strict mode conventions

#### Testing Requirements

- All new generators must have comprehensive tests
- Core changes require both unit and integration tests
- Template changes should include snapshot tests
- Error paths must be tested

#### Documentation Standards

- All public APIs must have JSDoc comments
- Complex algorithms should have inline documentation
- Changes must update relevant documentation files
- Examples should be provided for new features

### Common Patterns & Anti-Patterns

#### ✅ Recommended Patterns

```typescript
// Use BaseGenerator for all generators
class MyGenerator extends BaseGenerator {
  validateInput(data: PromptAnswers): void {
    validateMyInput(data.name);
  }
}

// Use ActionBuilder for action creation
return ActionBuilder.forGenerator('my-type', name).withData(data).addMainFile().build();

// Use centralized validation
export function validateMyInput(name: string): void {
  if (!isValid(name)) {
    throw new Error('Invalid input');
  }
}
```

#### ❌ Anti-Patterns

```typescript
// Don't create generators without BaseGenerator
function myGenerator(plop: NodePlopAPI) {
  plop.setGenerator('my-generator', {
    // Direct PlopJS configuration
  });
}

// Don't build actions manually
const actions = [
  {
    type: 'add',
    path: 'hardcoded/path/{{name}}.vue',
    templateFile: 'templates/my-template.hbs',
  },
];

// Don't inline validation
if (name.length === 0) {
  throw new Error('Name required');
}
```

### Debugging & Troubleshooting

#### Common Issues

1. **Template Errors**: Check Handlebars syntax and helper usage
2. **Path Resolution**: Verify strategy registration and path logic
3. **Validation Failures**: Ensure validation functions are properly imported
4. **Generation Failures**: Check file permissions and target directories

#### Debug Tools

- Enable PlopJS debug mode: `DEBUG=plop:* npx plentyshop generate`
- Use error handler verbose mode for detailed error information
- Check generated file snapshots in tests for expected output

This architecture provides a solid foundation for extending the CLI while maintaining consistency and reliability across all generators.
