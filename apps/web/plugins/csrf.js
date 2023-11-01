import { ref } from 'vue';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxt) => {
    const CSRFtoken = ref('');

    const getCSRFToken = () => CSRFtoken.value;

    const updateCSRFToken = (token) => {
        CSRFtoken.value = token;
    };

    const attachCSRFToForm = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach((form) => {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = CSRFtoken.value;
            form.append(csrfInput);
        });
    };

    const csrfRef = {
        token: CSRFtoken,
        getCSRFToken,
        updateCSRFToken,
        attachCSRFToForm,
    };

    // Store the original fetch function
    //const originalFetch = window.fetch;

    /* // Override the fetch function
    window.fetch = async (url, options = {}) => {
        if (['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
            options.headers = options.headers || {};
            options.headers['X-CSRF-Token'] = CSRFtoken.value;
        }
        return originalFetch(url, options);
    }; */

    // Register the global property
    nuxt.provide('$csrf', csrfRef);

    return csrfRef;
});
