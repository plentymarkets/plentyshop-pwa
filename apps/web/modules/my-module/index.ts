import { addImports, createResolver, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: 'plentyshop-modules',
        configKey: 'plentyshopModules',
    },
    defaults: {},
    setup(_options, _nuxt) {
        const resolver = createResolver(import.meta.url);

        // Override specific utils from the main app by adding them with explicit imports
        // This allows selective overriding instead of replacing the entire utils directory
        addImports({
            name: 'paths',
            from: resolver.resolve('./runtime/utils/paths'),
        });

        // Remove the original paths import from app/utils to avoid duplication warning
        _nuxt.hook('imports:extend', (imports) => {
            const pathsIndex = imports.findIndex(
                (i) => i.name === 'paths' && i.from.includes('app/utils/paths')
            );
            if (pathsIndex !== -1) {
                imports.splice(pathsIndex, 1);
            }
        });
    },
});