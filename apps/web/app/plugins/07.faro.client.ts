/**
 * Grafana Faro Web SDK Plugin
 *
 * This plugin initializes Faro for Real User Monitoring (RUM) and sends
 * telemetry data to our OpenTelemetry collector infrastructure.
 */

import {
  getWebInstrumentations,
  initializeFaro,
  type Faro,
  type TransportItem,
  type APIEvent,
} from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export default defineNuxtPlugin((nuxtApp) => {
  // Only initialize on client side
  if (import.meta.server) {
    return;
  }

  const config = useRuntimeConfig();

  // Skip initialization if token is not provided or in development
  if (!config.public.faroToken) {
    console.warn('[Faro] No token provided, skipping initialization');
    return;
  }

  // Initialize Faro with OpenTelemetry backend
  const faro: Faro = initializeFaro({
    // OpenTelemetry endpoint (your existing infrastructure)
    url: 'https://otel-ingest.plenty.rocks/v1/traces',

    // API key for authentication
    apiKey: config.public.faroToken,

    // Application metadata
    app: {
      name: 'plentyshop-pwa',
      version: String(config.public.appVersion || '1.15.0'),
      environment: String(config.public.environment || 'production'),
    },

    // Web instrumentations for automatic data collection
    instrumentations: [
      ...getWebInstrumentations({
        // Capture console logs (errors, warnings, info)
        captureConsole: true,
      }),
      // Capture distributed traces for user interactions
      new TracingInstrumentation(),
    ],

    // GDPR Compliance: Do not identify users by default
    // User identification requires explicit consent
    user: undefined,

    // Optional: Sampling to reduce data volume
    // Uncomment to sample only 10% of sessions
    // sessionSampleRate: 0.1,

    // Data sanitization hook (GDPR compliance)
    beforeSend: (item: TransportItem<APIEvent>) => {
      // Sanitize URLs: Remove sensitive query parameters
      const payload = item.payload;
      if ('url' in payload && typeof payload.url === 'string') {
        try {
          const url = new URL(payload.url);
          const sensitiveParams = [
            'password',
            'token',
            'api_key',
            'apiKey',
            'apikey',
            'accessToken',
            'access_token',
            'secret',
            'auth',
            'authorization',
          ];

          sensitiveParams.forEach((param) => {
            if (url.searchParams.has(param)) {
              url.searchParams.set(param, '[REDACTED]');
            }
          });

          (payload as { url: string }).url = url.toString();
        } catch {
          // Invalid URL, skip sanitization
        }
      }

      // Sanitize console logs: Remove potential PII
      if (item.type === 'log' && 'message' in payload && payload.message) {
        const message = String(payload.message);

        // Pattern matching for common PII
        const piiPatterns = [
          { pattern: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi, replacement: '[EMAIL]' }, // Email
          { pattern: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, replacement: '[SSN]' }, // SSN
          { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: '[CARD]' }, // Credit card
          { pattern: /\b\d{10,}\b/g, replacement: '[NUMBER]' }, // Long numbers
        ];

        let sanitized = message;
        piiPatterns.forEach(({ pattern, replacement }) => {
          sanitized = sanitized.replace(pattern, replacement);
        });

        (payload as { message: string }).message = sanitized;
      }

      return item;
    },
  });

  // Integrate with Nuxt/Vue error handling
  nuxtApp.hook('vue:error', (error, instance, info) => {
    faro.api.pushError(error instanceof Error ? error : new Error(String(error)), {
      context: {
        vueComponent: instance?.$options?.name || 'Unknown',
        errorInfo: info,
        route: useRouter().currentRoute.value?.path,
      },
    });
  });

  // Track route changes as page views
  nuxtApp.hook('page:finish', () => {
    const route = useRouter().currentRoute.value;

    faro.api.pushMeasurement({
      type: 'page_view',
      values: {
        timestamp: Date.now(),
      },
      context: {
        path: route.path,
        name: route.name ? String(route.name) : 'unknown',
      },
    });
  });

  // Make faro available globally via useNuxtApp().$faro
  return {
    provide: {
      faro,
    },
  };
});
