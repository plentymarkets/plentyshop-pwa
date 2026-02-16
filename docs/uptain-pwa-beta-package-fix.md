# uptain-pwa-beta: Was im Paket geändert werden muss

Damit das Paket nach `npm install uptain-pwa-beta` ohne Patches funktioniert, muss der **Client-Code** so umgebaut werden, dass er **keine Nuxt-Auto-Imports** aus dem App-Kontext braucht – weil Code in `node_modules` diese Auto-Imports nicht bekommt.

---

## 1. Wo das Problem liegt

| Datei | Verwendet (ohne Import) | Konsequenz |
|-------|-------------------------|------------|
| `runtime/plugins/uptain.client.ts` | `useUptainData`, `useRoute`, `useSiteSettings`, `useRuntimeConfig`, `useCookieBar`, `useProduct` | Laufzeitfehler „useRoute is not defined“ usw. |
| `runtime/composables/useUptainData.ts` | `useRuntimeConfig`, `useState` (teilw. importiert), `useCustomer`, `useWishlist`, `useSiteSettings`, `useProducts`, `useCustomerOrders`, `useCategoryFilter`, `useSearch` | Gleiche Fehler, sobald das Composable läuft |
| `runtime/plugins/uptain-cookie-registration.server.ts` | `useRegisterCookie` (von shop-core) | Kann mit try/catch abgefangen werden (läuft nur Server) |
| `runtime/plugins/uptain-i18n.ts` | Bereits angepasst (nutzt `nuxtApp`-Parameter) | OK |
| `runtime/components/.../UptainSettings.vue` | `useSiteSettings` | Kann in Komponenten evtl. noch funktionieren, je nach Build |

Kern: Alles, was in **Plugins** und im **Composable** aus `node_modules` läuft, darf sich **nicht** auf Auto-Imports verlassen.

---

## 2. Ansatz: Dependency Injection (empfohlen)

Statt `useRoute()`, `useRuntimeConfig()` usw. **direkt** aufzurufen, bekommen Plugin und Composable alle Abhängigkeiten **von außen** (vom Aufrufer).

### 2.1 Interface für Abhängigkeiten

Im Paket z.B. neu anlegen: `runtime/types/uptain-context.ts`:

```ts
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { RuntimeConfig } from 'nuxt/schema';

export interface UptainContext {
  route: Ref<RouteLocationNormalizedLoaded> | RouteLocationNormalizedLoaded;
  getRuntimeConfig: () => RuntimeConfig;
  getState: <T>(key: string, init: () => T) => Ref<T>;
  useCustomer: () => { user: Ref<...>; isAuthorized: Ref<boolean> };
  useWishlist: () => { wishlistItemIds: Ref<...>; data: Ref<...>; loading: Ref<boolean>; fetchWishlist: () => Promise<...> };
  useSiteSettings: (key: string) => { getSetting: () => unknown; updateSetting?: (v: unknown) => void };
  useProducts: () => { data: Ref<...>; currentProduct?: Ref<...> };
  useCustomerOrders?: () => { fetchCustomerOrders: () => Promise<...> };
  useCategoryFilter?: () => { getFacetsFromURL: () => ... };
  useSearch?: () => { data: Ref<...> };
}
```

(Die genauen Typen aus eurem Projekt/shop-api/shop-core einsetzen.)

### 2.2 Client-Plugin: Kontext im Nuxt-App-Kontext holen und übergeben

Im **Paket** bleibt nur ein Plugin, das **im laufenden Nuxt-App-Kontext** die Composables einmal aufruft und das Composable mit diesem Kontext füttert:

**`runtime/plugins/uptain.client.ts`** (vereinfacht):

```ts
import { defineNuxtPlugin } from 'nuxt/app';
import { useUptainData } from '../composables/useUptainData';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.runWithContext(() => {
    const route = nuxtApp._route ?? useRoute();
    const runtimeConfig = useRuntimeConfig();
    const context: UptainContext = {
      route,
      getRuntimeConfig: () => useRuntimeConfig(),
      getState: (key, init) => useState(key, init),
      useCustomer: () => useCustomer(),
      useWishlist: () => useWishlist(),
      useSiteSettings: (key) => useSiteSettings(key),
      useProducts: () => useProducts(),
      useCustomerOrders: () => useCustomerOrders(),
      useCategoryFilter: () => useCategoryFilter(),
      useSearch: () => useSearch(),
    };
    const { getAllData, shouldBlockCookies, getUptainId } = useUptainData(context);
    // … Rest der bisherigen Plugin-Logik, nutzt getAllData, shouldBlockCookies, getUptainId
  });
});
```

Wichtig: **Alle** Aufrufe wie `useRoute()`, `useRuntimeConfig()`, `useCustomer()` usw. stehen **nur hier** – und zwar innerhalb von `runWithContext`, also im App-Kontext, wo Auto-Imports verfügbar sind.  
Das Composable **darf** diese Funktionen **nicht** mehr selbst aufrufen.

### 2.3 Composable: Nur noch den Kontext nutzen

**`runtime/composables/useUptainData.ts`**:

- **Keine** Imports mehr von `nuxt/app` für `useRuntimeConfig`, `useRoute`, `useState`.
- **Keine** Aufrufe von `useCustomer`, `useWishlist`, `useSiteSettings`, `useProducts` usw.
- Stattdessen: **Ein Parameter** `context: UptainContext` (oder `options` mit diesem Typ).

Beispiel:

```ts
export function useUptainData(context: UptainContext) {
  const route = computed(() => unref(context.route));
  const runtimeConfig = context.getRuntimeConfig();
  const { user, isAuthorized } = context.useCustomer();
  const { wishlistItemIds, data: wishlistData, loading: wishlistLoading, fetchWishlist } = context.useWishlist();
  const { getSetting } = context.useSiteSettings('uptainId');
  // … usw., nur noch context.* verwenden
  const revenueCache = context.getState<string | null>('uptain-revenue-cache', () => null);
  // …
}
```

Damit läuft die ganze Logik weiter im Paket, aber **ohne** Abhängigkeit von Auto-Imports in `node_modules`.

### 2.4 Server-Plugin und Komponenten

- **uptain-cookie-registration.server.ts**: Bleibt wie besprochen (z.B. try/catch um `useRegisterCookie`, optional expliziter Import aus shop-core, falls möglich).
- **UptainSettings.vue**: Wenn hier weiterhin `useSiteSettings` aus dem App-Kontext genutzt wird und es in eurem Build funktioniert, könnt ihr es so lassen. Sonst müsst ihr auch hier auf einen per Props/Inject bereitgestellten Kontext umstellen.

---

## 3. Alternative: Auto-Imports für node_modules aktivieren

Wenn ihr **nicht** auf Dependency Injection umbauen wollt, könnt ihr versuchen, die **App** so zu konfigurieren, dass Auto-Imports auch für das Paket gelten. Das ist abhängig von Nuxt/Vite und nicht garantiert stabil.

In der **verwendenden App** (z.B. plentyshop-pwa) in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables',
      'composables/**',
      // Runtime des Pakets mit einschließen (Pfad ggf. anpassen)
      'node_modules/uptain-pwa-beta/runtime/composables',
      'node_modules/uptain-pwa-beta/runtime/plugins',
    ],
  },
  // …
});
```

Damit werden diese Ordner beim Generieren der Auto-Imports mit einbezogen. Ob das für **alle** Composables (inkl. solche aus shop-core) und für Client-Builds zuverlässig funktioniert, müsst ihr testen. Wenn ja, müsst ihr im Paket **trotzdem** alle verwendeten Nuxt/App-Composables **explizit** in den betroffenen Dateien importieren (aus `nuxt/app`, `#imports` oder wo sie exportiert werden), damit der Bundler sie trifft. Reines „drauf verlassen, dass Auto-Import schon da ist“ reicht in node_modules oft nicht.

---

## 4. Kurz-Checkliste fürs Paket

- [ ] **UptainContext** (oder Äquivalent) definieren mit allen benötigten Composables/Zugriffen.
- [ ] **uptain.client.ts**: Nur noch in `runWithContext` alle `use*()` aufrufen, **einmal** `context` bauen und `useUptainData(context)` aufrufen; Rest der Logik wie bisher, aber ohne weitere Composable-Aufrufe außer über `context`.
- [ ] **useUptainData.ts**: Keine direkten `use*()`-Aufrufe mehr; nur noch Nutzung von `context` (getRuntimeConfig, getState, useCustomer, useWishlist, useSiteSettings, useProducts, useCustomerOrders, useCategoryFilter, useSearch, route).
- [ ] **uptain-cookie-registration.server.ts**: Robust machen (try/catch, ggf. expliziter Import für `useRegisterCookie`).
- [ ] **uptain-i18n.ts**: Bleibt mit `nuxtApp`-Parameter (bereits angepasst).
- [ ] Optional: README des Pakets anpassen (Installation, Voraussetzungen, Hinweis auf Nuxt 3 + shop-core).

Wenn ihr das so im Paket umsetzt, sollte „einfach installieren und Modul in die Config“ ohne Patches in der App funktionieren.
