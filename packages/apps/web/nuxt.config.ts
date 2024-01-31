// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
    devtools: { enabled: true },
    extends: [
        '../../../apps/web',
    ],
    typescript: {
        typeCheck: false,
    },
})
