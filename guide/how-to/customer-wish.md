# Customer wish

The customer wish input field allows customers to leave additional comments or wishes during the checkout process. This can be useful for delivery instructions or special requests, improving the communication between shop and customer.

To enable this feature in the PlentyONE Shop, you need to configure an environment variable in the PWA.

### PlentyONE Shop

Open the PWA's apps/web/.env file and ensure the following entry exists:

```
SHOW_CUSTOMER_WISH_COMPONENT=1
```

If the entry is missing, add it. If the entry exists but is set to `0`, change it to `1` to enable the customer wish input field during checkout.

## Disabling the feature

To disable the customer wish input, either remove the line or set the value to `0`:

```
SHOW_CUSTOMER_WISH_COMPONENT=0
```

This removes the input field from the checkout view.
