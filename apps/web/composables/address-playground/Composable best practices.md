## Composable best practices (WIP)

### Naming Convention
- Start with `use` and camel case the rest
    - Example: `useCustomer`

### SRP (Single Responsibility Principle)
- Each composable should have a single responsibility

```
composables/
├── useCustomer/
│   └── useCustomer.ts
├── useCreateCustomer/
│   └── useCreateCustomer.ts
├── useDeleteCustomer/
│   └── useDeleteCustomer.ts
```

### Split Composables into State and Action Composables
- Use separate composables for state and actions
    - Example: `useCustomer` for state
    - Example: `useCreateCustomer` for action

### Component-Bound Composables
- Composables that should only be used once with one component
    - Example: `Checkout.vue` in pages as component
    - Example: `useCheckoutPage` as composable that is only used in the `Checkout.vue`

```
pages/
├── Checkout.vue
composables/
├── useCheckoutPage/
│   └── useCheckoutPage.ts
```

- This enables us to unit test the logic without having to test the .vue template file.

### Avoid Side Effects
- What is it?
    - Side effects are unintended changes in state or behavior caused by a function or composable.
- How to avoid them:
    - Use events that can be used in business logic composables.
    - Example: `useAddressStore`
        - `onCreate` event

```ts
// Checkout.vue or CheckoutPageComposable
onCreate((event) => {
    const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
    setCheckoutAddress(event.payload[0], true);
});
```

- This way we don't set the checkout address while creating a new address but do it elsewhere.