# Bot protection

Implementing bot protection safeguards your shop against automated spamming activities, such as inundating contact forms with unwanted and irrelevant messages, ensuring a streamlined and efficient communication process for genuine users.

By deploying bot protection, you can enhance the overall user experience, maintain data integrity, and mitigate the risk of fraudulent or malicious activities that can compromise the security and functionality of your shop.

plentyShop PWA uses Cloudflare Turnstile to implement bot protection.

## Cloudflare Turnstile

Cloudflare Turnstile CAPTCHA serves as an elective functionality, presenting visitors to your website with a CAPTCHA challenge. The challenge safeguards your website against spam and abuse, facilitating smooth interactions for genuine users.

::: info
Opting not to implement this feature will not impede the normal functioning of your website.
:::

### How it works

Cloudflare Turnstile is a CAPTCHA widget that automatically challenges visitors. There are three modes configurable in the Cloudflare dashboard:

- **Managed**: Cloudflare will use information from the visitor to decide if an interactive challenge should be used. If they show an interaction, the user will be prompted to check a box. Users don't have to decipher any images or text.
- **Non-interactive**: A purely non-interactive challenge. Users will see a widget with a loading bar while the browser challenge is run.
- **Invisible** : Invisible challenge that does not require interaction.

For further information, refer to the [Turnstile documentation](https://developers.cloudflare.com/turnstile/).

## Enabling Cloudflare Turnstile

This section describes how to enable Turnstile for your shop. You have to take action in Cloudflare, your plentysystems system and the plentyShop PWA configuration.

### Cloudflare

1. Create a Cloudflare account.
2. Go to **Turnstile » Add site**.
3. Add your website with your domain(s) and click **Create**.

Cloudflare generates a secret key and a sitekey. You need both keys in the next steps.

### plentysystems

1. Log into your plentysystems system.
2. Go to **Setup » Client » Your Shop » Online store » Settings**.
3. Paste the secret key in the **Cloudflare Turnstile Secret key (only PWA)** field.
4. **Save** the settings.

### plentyShop PWA

Paste the sitekey in the PWA `nuxt.config.ts` file in the `turnstile` section:

```ts
turnstile: {
    siteKey: '0x4AAAZACDNx3aXDh7UR35x9'
}
```

## Disabling Cloudflare Turnstile

To disable Turnstile, you have to reset the configurations in the plentysystems system and plentyShop PWA.

### plentysystems

1. Log into your plentysystems system.
2. Go to **Setup » Client » Your Shop » Online store » Settings**.
3. Remove the secret key from the **Cloudflare Turnstile Secret key (only PWA)** field.
4. **Save** the settings.

This disables the CAPTCHA validation.

### plentyShop PWA

Remove the sitekey from the PWA `nuxt.config.ts` file in the `turnstile` section. This removes the widget in the PWA:

```ts
turnstile: {
    siteKey: ''
}
```

## CAPTCHA protected features

- Subscribing to the newsletter
