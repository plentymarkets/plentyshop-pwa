export interface ExtensionEntry {
  /** Unique identifier for the extension (used as runtimeConfig key). */
  id: string;
  /** The Nuxt module entry point, e.g. "@agency-x/mollie-payment-ext/module". */
  entry: string;
  /** Load priority — lower numbers load first. Defaults to 100. */
  priority?: number;
  /** Arbitrary settings injected into runtimeConfig.public[id]. */
  settings?: Record<string, unknown>;
}