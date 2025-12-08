import { addComponentsDir, addImports, addPlugin, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: 'last-seen',
        configKey: 'lastSeen',
    },
    defaults: {
        enabled: true,
        maxItems: 10,
    },
    setup(options, nuxt) {
        console.log('Last Seen module setup with options:', options);
        const resolver = createResolver(import.meta.url);

        addImports({
            name: 'useLastSeen', // name of the composable to be used
            as: 'useLastSeen',
            from: resolver.resolve('runtime/composables/useLastSeen'), // path of composable
        })

        addComponentsDir({
            path: resolver.resolve('runtime/components'),
            global: true,
        })

        addPlugin(resolver.resolve('./runtime/plugin/addLastSeen.ts'));

        nuxt.options.runtimeConfig.public.lastSeen = {
            enabled: options.enabled,
            maxItems: options.maxItems,
        };
    },
});
