Composable best practices (WIP)

- Name convention start with use and camel case the rest
    - `useCustomer`
- SRP Single responsibility
- You can split composables into state and action composables
- Use a component bind composable (composable that should only be used once with one component)
- To avoid side effects, we can use events that can be used in business logic composables.