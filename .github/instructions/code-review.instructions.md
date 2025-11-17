---
excludeAgent:
  - 'coding-agent'
---

# Code Review Instructions

When reviewing code changes, please adhere to the following guidelines:

## General

- Do NOT suggest changes that are already enforced by ESLint or other automated tools. Cf. `apps/web/.eslintrc.js` for current ESLint configuration and `apps/web/eslint-rules` for custom rules.
- Focus on code quality, readability, maintainability, and adherence to project conventions.
- Ensure that new code follows the established architectural patterns of the project.

## TypeScript

- Types should be defined in a `types.ts` file within the same directory as the component or module they pertain to.
- Complex types should have a dedicated `interface` or `type` instead of inlining the definition.
- If the interface or type defines a prop, it should be suffixed with `Props` (e.g., `UserProps`).

## Vue / Nuxt

- Components should be presentational where possible. Avoid embedding business logic directly within components.
- Business logic should be abstracted into composables or modules.
- Composables should contain stateful logic and functionality that requires access to the Vue or Nuxt lifecycle or the Nuxt app.
- Modules should contain stateless logic and pure functions that do not depend on Vue or Nuxt lifecycle or app context.
- If a module is tightly coupled to a specific composable, it should be placed within the same directory as that composable.
- If a module is generic and reusable across different parts of the application, it should be placed in the `utils` directory.

- Components should focus on a single responsibility.
- Components should use `@storefront-ui/vue` components where applicable to maintain design consistency.
  <!-- TODO: Encode exceptions as ESLint rules -->
  - Exception: Instead of `SfButton`, use `UiButton`.
  - Exception: Instead of `SfDropdown`, use `Multiselect`.
  - Exception: Instead of `SfScrollable`, use `Swiper`.
- Additional base components should be created in `components/ui` (for shop) or `components/editor` (for cms) as needed to promote reusability and consistency.

- Communication between parent-child components should use props and events.
- All other communication between components should be handled via composables or `usePlentyEvent` from `@plentymarkets/shop-core`.
- State should be managed with Nuxt's built-in `useState` composable.

- Nuxt's auto-import feature should be used as much as possible.
- Use `defineAsyncComponent` for heavy components that aren't immediately needed.

### Error Handling

- Use try-catch blocks for asynchronous operations that may fail.
- Use `useNotification` from `@plentymarkets/shop-core` to display error messages to users.

### Blocks / Settings

- If the interface of a block or setting changes, a data mapping should ensure backward compatibility with existing data.
- Data mappings should handle missing properties with sensible defaults.

## Tests

- Components, composables, and modules should have unit tests that cover their functionality.
- Components should tag elements with `data-testid` attributes, so that tests can target them over other selectors like classes or element types.

- Tests should be placed in a `__tests__` directory adjacent to the code they are testing.
- Tests should use descriptive names for test cases to clearly indicate what is being tested.
- Tests should follow the Arrange-Act-Assert pattern for clarity.
- Test cases should use `it` blocks for individual assertions and `describe` blocks for grouping related tests. Each case should use "should" syntax to describe expected behavior (e.g., `it(should return X when Y)`).
- Tests should use mocking as little as possible. If extensive mocking is required, consider if the code under test is too tightly coupled and needs refactoring. For example, if a composable requires mocking a lot of state, consider separating stateful and stateless logic into a composable and a module, respectively, so they can be tested independently.
- Tests should avoid testing implementation details. Focus on testing the public API and behavior of the code. In other words, if the behavior of the unit under test changes, the test should fail; if the implementation details change but the behavior remains the same, the test should still pass.
- Tests should be deterministic and not rely on external factors or state.
- Test data should be maintained in fixtures.

- E2E tests should cover critical user flows and interactions.
- Each E2E test should cover a user journey and not be fragmented into multiple smaller tests. For testing individual components or pages, use unit tests instead.
- Page Object pattern should encapsulate page-specific selectors and actions.
- Chain assertions fluently for readability.

## Documentation

- Add TSDoc comments to all public functions, classes, and complex types.
- Ensure that comments are clear, concise, and provide value beyond what the code itself conveys.
