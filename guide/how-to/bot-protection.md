# Bot protection
Implementing Bot Protection makes sense as it safeguards against automated spamming activities, such as inundating contact forms with unwanted and irrelevant messages, ensuring a streamlined and efficient communication process for genuine users.
By deploying Bot Protection, you can enhance the overall user experience, maintain data integrity, and mitigate the risk of fraudulent or malicious activities that can compromise the security and functionality of your shop.

## Cloudflare Turnstile

The Cloudflare Turnstile CAPTCHA serves as an elective functionality, presenting visitors to your website with a CAPTCHA challenge.
By doing so, it safeguards your website against spam and abuse, facilitating the smooth passage of genuine users.
Opting not to implement this feature will not impede the normal functioning of your website.

### How it works

Cloudflare Turnstile is a CAPTCHA widget that automatically challenges visitors. There are three modes configurable in the Cloudflare dashboard:
- **Managed** (Cloudflare will use information from the visitor to decide if an interactive challenge should be used. If they show an interaction, the user will be prompted to check a box (no images or text to decipher).)
- **Non-interactive** (A purely non-interactive challenge. Users will see a widget with a loading bar while the browser challenge is run.)
- **Invisible**  (Invisible challenge that does not require interaction.)

For more information check: https://developers.cloudflare.com/turnstile/

### How to enable Cloudflare Turnstile

1. Create a cloudflare account
2. Go to **Turnstile » Add site**, add your website with your domain(s) and click **Create**
3. Copy the `Secret Key`
   - Log into your plentysystems system.
   - Go to **Setup » Client » Your Shop » Online store » Settings**
   - Paste the `Secret Key` in the `Cloudflare Turnstile Secret key (only PWA)` field
   - **Save** the settings
4. Copy the `Site Key` and paste it in the PWA `nuxt.config.ts` file in the `turnstile` section

Example:
```ts
turnstile: {
    siteKey: '0x4AAAZACDNx3aXDh7UR35x9'
}
```

### How to disable Cloudflare Turnstile
1. Remove the `Secret Key` from the `Cloudflare Turnstile Secret key (only PWA)` field
   - This will disable the CAPTCHA validation
2. Remove the `Site Key` from the PWA `nuxt.config.ts` file in the `turnstile` section
   - This will remove the widget in the PWA

## CAPTCHA protected features

- Subscribing to the newsletter