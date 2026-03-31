---
prev: false
next: false
---

# Error Handling

## useHandleError

The `useHandleError` composable provides a streamlined way to handle and display translated error messages throughout your app.

### Example

```typescript
try {
  await useSdk().plentysystems.doAddCoupon(params);
} catch (error) {
  useHandleError(error as ApiError);
} finally {
  state.value.loading = false;
}
```

If the `doAddCoupon` method fails, it will throw an error of type [ApiError](/reference/api/classes/ApiError#class-apierror).

This error is then passed as a parameter to the `useHandleError` function.

The [ApiError](/reference/api/classes/ApiError#class-apierror) object includes a `key` property used to look up the corresponding translation in `i18n`, our internationalization framework.

For example, the `key` from the `ApiError` might be `coupon.applyFailed`.

The corresponding translation key in `en.json` would look like this:

```json
"storefrontError": {
    "coupon": {
      "applyFailed": "The coupon could not be redeemed."
    },
}
```

The composable automatically deconstructs the translation key, retrieves the appropriate translation, and dispatches a notification using the `send` method from `useNotification`.

This approach enables you to customize and override error messages from the API, providing localized and user-friendly feedback.
