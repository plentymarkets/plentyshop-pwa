# @plentymarkets/shop-generators

PlopJS code generators for PlentyONE Shop PWA development.

## Overview

This package provides standardized code generators for creating consistent components, composables, pages, and other code structures in PlentyONE Shop PWA projects.

## Installation

```bash
npm install @plentymarkets/shop-generators
```

## Usage

### Using the CLI

```bash
npx plenty-plop
```

### Using with Plop directly

```bash
npx plop --plopfile node_modules/@plentymarkets/shop-generators/plopfile.js
```

## Available Generators

🚧 **Work in Progress** - Generators will be added in the following phases:

### Phase 2 (Week 2)
- [ ] Vue Component Generator
- [ ] UI Component Generator  
- [ ] Settings Component Generator

### Phase 3 (Week 3)
- [ ] Composables Generator
- [ ] Pages Generator
- [ ] Block Component Generator

### Phase 4 (Week 4)
- [ ] Test File Generator

## Features

- ✅ **Input Validation**: Comprehensive validation for all prompts
- ✅ **Conflict Detection**: Prevents overwriting existing files
- ✅ **Dry-run Mode**: Preview changes before applying
- ✅ **TypeScript Support**: Full TypeScript integration
- ✅ **Test Generation**: Automatic test file creation
- ✅ **Naming Conventions**: Enforced PlentyONE patterns

## Development

This package is part of the PlentyONE Shop PWA monorepo and follows the established development patterns.

### Template Structure

Templates are organized by type:
- `templates/component/` - Vue component templates
- `templates/composable/` - Composable templates
- `templates/settings/` - Settings component templates
- `templates/page/` - Page templates
- `templates/ui/` - UI component templates
- `templates/test/` - Test file templates

### Custom Helpers

The package includes custom Handlebars helpers for consistent naming:
- `pascalCase` - PascalCase conversion
- `camelCase` - camelCase conversion
- `kebabCase` - kebab-case conversion
- `snakeCase` - snake_case conversion
- `constantCase` - CONSTANT_CASE conversion

## License

BSD-3-Clause

## Contributing

This package is developed as part of the PlentyONE Shop PWA project. See the main project documentation for contribution guidelines.
