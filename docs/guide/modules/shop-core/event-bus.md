---
prev: false
next: false
---

# Event Bus

The Shop Core module provides a powerful event bus system for emitting and listening to shop-related events. This enables different parts of your app to communicate in a decoupled way, making your codebase more modular and maintainable.

## Why Use an Event Bus?

An event bus allows you to:

- React to user actions (e.g., adding to cart, placing an order)
- Broadcast changes across components without direct dependencies
- Keep your business logic organized and separated from UI concerns

## API

### usePlentyEvent

The `usePlentyEvent` composable exposes a simple API for working with events:

```ts
const { on, emit } = usePlentyEvent();

on('frontend:addToCart', (payload) => {
  // Handle event when a product is added to the cart
});

emit('frontend:addToCart', { productId: 123 });
```

- `on(event: string, handler: Function)`: Listen to a specific event and execute a handler when it occurs.
- `emit(event: string, payload?: any)`: Emit an event with an optional payload to notify listeners.

## Common Events

Here are some common events you might use in your app:

- `'frontend:addToCart': { addItemParams: DoAddItemParams; cart: Cart; item: CartItem };`
- `'frontend:removeFromCart': { deleteItemParams: DeleteCartItemParams; cart: Cart; item?: CartItem };`
- `'frontend:beginCheckout': Cart;`
- `'frontend:addToWishlist': { variationId: number };`
- `'frontend:signUp': { user: User; method?: string };`
- `'frontend:login': { user: User; method?: string };`
- `'frontend:productLoaded': { product: Product };`
- `'frontend:orderCreated': Order;`
- `'frontend:searchProduct': string;`
- `'frontend:paypalAPMsLoaded': null;`
- `'backend:AfterBasketChanged': AfterBasketChanged;`
- `'backend:CheckoutChanged': CheckoutChanged;`
- `'backend:AfterAccountAuthentication': AfterAccountAuthentication;`
- `'backend:FrontendUpdateCustomerSettings': FrontendUpdateCustomerSettings;`
- `'module:clearCart': null;`

::: tip Missing events?
If you need any additional events we currently don't provide, reach out in the [community area](https://help.plentyone.com/hc/en-gb/community/topics/27021876313746-Shop).
:::
