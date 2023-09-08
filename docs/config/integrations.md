# Integrations configuration

## PayPal

Open [`integration.config.ts`](../../apps/web/integration.config.ts) and enter the following data:

- `clientId`
- `merchantId`
- `paymentId`

You get the [client ID](https://developer.paypal.com/api/rest/#link-getclientidandclientsecret) and [merchant ID](https://www.paypal.com/us/cshelp/article/how-do-i-find-my-secure-merchant-id-on-my-paypal-account-help538) from PayPal.

For the payment ID, log into your plentysystems system and carry out the following steps:

1. Go to **Setup » Orders » Payment » Method**
2. In the table of payment methods, search for the **PayPal** entry with a :white_check_mark: in the **Back end activated** column.
