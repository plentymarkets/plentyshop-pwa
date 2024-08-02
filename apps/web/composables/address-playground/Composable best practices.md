## Composable best practices (WIP)

### Name convention start with use and camel case the rest
    - `useCustomer`
### SRP Single responsibility principal
```
composables/
├── useCustomer/
│   └── useCustomer.ts
├── useCreateCustomer/
│   └── useCreateCustomer.ts
├── useDeleteCustomer/
│   └── useDeleteCustomer.ts
```
### Split composables into state and action composables
    - `useCustomer` for state
    - `useCreateCustomer` for action 
### Use a component bind composable
composable that should only be used once with one component
    - `Checkout.vue` in pages as component
    - `useCheckoutPage` as composable that is only used in the `checkout.vue`
```
pages/
├── Checkout.vue
composables/
├── useCheckoutPage/
│   └── useCheckoutPage.ts
```

This enables use to unit test the logic without having to test the .vue template file.

### Avoid side effects

- What is it?
    - 
- How to avoid them: 
- To avoid side effects, we can use events that can be used in business logic composables.
- `useAddressStore` 
    - `onCreate` event

- component or other composable that waits for `onCreate` and then sets it as checkout address with:
``` ts
onCreate((event) => {
    const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
    setCheckoutAddress(event.payload[0], true);
});
```

- This way we dont set the checkout address while creating a new address but do it else where.