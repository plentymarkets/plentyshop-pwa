import { useLogger, defineNuxtModule, createResolver } from '@nuxt/kit';
import type { TailwindColors } from './types';
import type { Config as TailwindConfig } from 'tailwindcss/types/config';

export default defineNuxtModule({
  meta: {
    name: 'nk-override',
    configKey: 'nk-override',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const logger = useLogger('NK pwa-module-boilerplate');

    /**
     * Hook to modify the TailwindCSS configuration
     */
    nuxt.hook('tailwindcss:config', (config: Partial<TailwindConfig>) => {
      // Add the runtime components to the TailwindCSS content to enable Tailwind classes in the components
      if (config.content && Array.isArray(config.content)) {
        (config.content as string[]).push(resolve('./runtime/**/*.{vue,mjs,ts}'));
        (config.content as string[]).push(resolve('./runtime/**/*.{mjs,js,ts}'));
      }

      if (config?.theme?.extend && typeof config.theme.extend.colors === 'object') {
        const colors = config.theme.extend.colors as TailwindColors;
        if (!colors.gray) {
          colors.gray = {};
        }
        colors.gray['100'] = '#F7F7F7';
        colors.gray['200'] = '#dcdcdc';
        colors.gray['300'] = '#ACACAC';
        colors.gray['600'] = '#6A6A6A';
        colors.gray['800'] = '#5A5A5A';
/*
        if (!colors.neutral) {colors.neutral = {};}
        colors.neutral['300'] = '#dc2626';

        if (!colors.secondary) {colors.secondary = {};}
        colors.secondary['100'] = '#dc2626';
*/

      }

      // Set custom font sizes
      if (config?.theme?.extend) {
        if (!config.theme.extend.fontSize) {
          config.theme.extend.fontSize = {};
        }
        (config.theme.extend.fontSize as Record<string, [string, string]>)['72'] = ['72px', '1.111em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['56'] = ['56px', '1.143em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['48'] = ['48px', '1.167em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['44'] = ['44px', '1.227em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['36'] = ['36px', '1.222em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['34'] = ['34px', '1.294em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['28'] = ['28px', '1.214em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['26'] = ['26px', '1.385em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['24'] = ['24px', '1.5em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['22'] = ['22px', '1.182em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['18'] = ['18px', '1.333em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['16'] = ['16px', '1.5em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['14'] = ['14px', '1.429em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['12'] = ['12px', '1.667em'];
      }

      // Set custom transition duration to 400ms
      if (config?.theme?.extend) {
        if (!config.theme.extend.transitionDuration) {
          config.theme.extend.transitionDuration = {};
        }
        (config.theme.extend.transitionDuration as Record<string, string>)['DEFAULT'] = '400ms';
      }

      // Set custom width for w-88
      if (config?.theme?.extend) {
        if (!config.theme.extend.width) {
          config.theme.extend.width = {};
        }
        (config.theme.extend.width as Record<string, string>)['88'] = '22rem';
      }
    });


    nuxt.hook('components:extend', (components) => {
      const blocksNewsletterSubscribe = components.find((c) => c.pascalName === 'BlocksNewsletterSubscribe'); 
      const blocksNewsletterSubscribeForm = components.find((c) => c.pascalName === 'BlocksNewsletterSubscribeForm'); 
      if (blocksNewsletterSubscribe) { 
        blocksNewsletterSubscribe.filePath = resolve('./runtime/components/blocks/NewsletterSubscribe/NewsletterSubscribe.vue'); }
      if (blocksNewsletterSubscribeForm) { 
        blocksNewsletterSubscribeForm.filePath = resolve('./runtime/components/blocks/NewsletterSubscribe/NewsletterSubscribeForm.vue'); }

      const blocksFooter = components.find((c) => c.pascalName === 'BlocksFooter'); 
      const blocksFooterForm = components.find((c) => c.pascalName === 'BlocksFooterForm'); 
      if (blocksFooter) { 
        blocksFooter.filePath = resolve('./runtime/components/blocks/Footer/Footer.vue'); }
      if (blocksFooterForm) { 
        blocksFooterForm.filePath = resolve('./runtime/components/blocks/Footer/FooterForm.vue'); }




    });

    /**
     * Ready hook to log a message when the module is ready
     */
    nuxt.hook('ready', () => {
      logger.info('pwa-module-boilerplate is ready');
    });
  },
});
