const EXCLUDED_STATE_KEYS = new Set<string>([
  '$sviewportState',
  '$toc-hovered-uuid', // local hover state; fires on every mouseenter — never needs bridge sync
]);

type TickListener = (changedKey?: string) => void;

interface EditorBridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pinia: any;
  state: Record<string, unknown>;
  listeners: Set<TickListener>;
  notify: (changedKey?: string) => void;
  subscribe: (fn: TickListener) => () => void;
  onIframeNavigate?: (path: string) => void;
  onTogglePlaceholder?: (uuid: string, position: string) => void;
  onSetInsertColumnUuid?: (uuid: string) => void;
}

const wrappedObjects = new WeakSet<object>();

const wrapDeepReactive = (target: unknown, notify: () => void, seen = new WeakSet<object>()): void => {
  if (target === null || typeof target !== 'object') return;
  if (seen.has(target as object)) return;
  seen.add(target as object);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyTarget = target as any;

  if (anyTarget.__v_isRef === true) {
    if (!wrappedObjects.has(target as object)) {
      const desc = Object.getOwnPropertyDescriptor(target, 'value');
      if (desc && desc.configurable) {
        const origGet = desc.get?.bind(target);
        const origSet = desc.set?.bind(target);
        if (origGet && origSet) {
          Object.defineProperty(target, 'value', {
            configurable: true,
            enumerable: desc.enumerable,
            get() {
              return origGet();
            },
            set(v) {
              origSet(v);
              wrapDeepReactive(v, notify, seen);
              notify();
            },
          });
          wrappedObjects.add(target as object);
        }
      }
    }
    try {
      wrapDeepReactive(anyTarget.value, notify, seen);
    } catch {
      /* ignore */
    }
    return;
  }

  if (Array.isArray(target)) {
    if (!wrappedObjects.has(target as object)) {
      const mutMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'] as const;
      mutMethods.forEach((m) => {
        const orig = anyTarget[m];
        Object.defineProperty(target, m, {
          configurable: true,
          writable: true,
          value: function (...args: unknown[]) {
            const result = orig.apply(this, args);
            notify();
            // Neu hinzugefügte Items rekursiv wrappen
            anyTarget.forEach((item: unknown) => wrapDeepReactive(item, notify, seen));
            return result;
          },
        });
      });
      wrappedObjects.add(target as object);
    }
    anyTarget.forEach((item: unknown) => wrapDeepReactive(item, notify, seen));
    return;
  }

  if (wrappedObjects.has(target as object)) return;

  const keys = Object.keys(anyTarget);
  keys.forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (!desc || !desc.configurable) return;
    if (desc.get || desc.set) return;

    let val = desc.value;
    wrapDeepReactive(val, notify, seen);

    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: desc.enumerable,
      get() {
        return val;
      },
      set(v) {
        val = v;
        wrapDeepReactive(v, notify, seen);
        notify();
      },
    });
  });
  wrappedObjects.add(target as object);
};

export default defineNuxtPlugin({
  name: 'editor-preview-bridge',
  enforce: 'pre',
  setup(nuxtApp) {
    if (typeof window === 'undefined') return;

    const isInIframe = window.parent !== window;
    const isPreviewMode = new URLSearchParams(window.location.search).has('__preview');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    if (!isInIframe || !isPreviewMode) {
      // ─────────── PARENT ───────────
      const listeners = new Set<TickListener>();
      const notify = (changedKey?: string) => {
        listeners.forEach((fn) => {
          try {
            fn(changedKey);
          } catch {
            /* ignore */
          }
        });
      };

      Object.keys(nuxtApp.payload.state).forEach((key) => {
        if (EXCLUDED_STATE_KEYS.has(key)) return;
        wrapDeepReactive((nuxtApp.payload.state as Record<string, unknown>)[key], () => notify(key));
      });

      const originalState = nuxtApp.payload.state as Record<string, unknown>;
      nuxtApp.payload.state = new Proxy(originalState, {
        set(target, prop: string, value) {
          target[prop] = value;
          if (!EXCLUDED_STATE_KEYS.has(prop)) {
            wrapDeepReactive(value, () => notify(prop));
            notify(prop);
          }
          return true;
        },
      });

      const bridge: EditorBridge = {
        pinia: nuxtApp.$pinia,
        state: nuxtApp.payload.state as Record<string, unknown>,
        listeners,
        notify,
        subscribe(fn) {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
      };

      w.__editorBridge = bridge;
      nuxtApp.hook('app:mounted', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const router = (nuxtApp as any).$router;
        bridge.onIframeNavigate = (path: string) => {
          if (!router) return;
          const currentPath = (router.currentRoute.value.fullPath as string).replace(/[?&]__preview=1$/, '');
          if (path !== currentPath) router.push(path);
        };
        const { togglePlaceholder } = useBlockManager();
        bridge.onTogglePlaceholder = (uuid: string, position: string) => {
          togglePlaceholder(uuid, position as Parameters<typeof togglePlaceholder>[1]);
        };
        const { setInsertColumnUuid } = useBlocksMutations();
        bridge.onSetInsertColumnUuid = (uuid: string) => {
          setInsertColumnUuid(uuid);
        };
      });
      return;
    }

    const bridge = w.parent.__editorBridge as EditorBridge | undefined;
    if (!bridge) {
      console.warn('[editor-preview] Parent bridge not available');
      return;
    }

    if (bridge.pinia) {
      nuxtApp.vueApp.use(bridge.pinia);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (nuxtApp as any).$pinia = bridge.pinia;
    }


    // Suppresses write-backs while syncKey is pushing parent values into a mirror.
    let isSyncing = false;
    // Tracks the first mirror created per key so updates can be applied in-place.
    const mirrorMap = new Map<string, Record<string, unknown>>();

    const makeReactiveMirror = (clonedVal: unknown, bridgeKey: string): unknown => {
      if (clonedVal === null || typeof clonedVal !== 'object' || Array.isArray(clonedVal)) {
        return clonedVal;
      }
      return reactive(
        new Proxy(clonedVal as Record<string, unknown>, {
          set(target, prop: string, value) {
            Reflect.set(target, prop, value);
            if (!isSyncing) {
              try {
                const parentTarget = (bridge.state as Record<string, unknown>)[bridgeKey];
                if (parentTarget !== null && typeof parentTarget === 'object') {
                  (parentTarget as Record<string, unknown>)[prop] = value;
                }
              } catch { /* ignore */ }
            }
            return true;
          },
        }),
      );
    };

    const existingState = nuxtApp.payload.state as Record<string, unknown>;
    const reactiveState = shallowReactive({ ...existingState });

    const syncKey = (key: string) => {
      if (EXCLUDED_STATE_KEYS.has(key)) return;
      const val = (bridge.state as Record<string, unknown>)[key];
      try {
        if (val === null || typeof val !== 'object') {
          reactiveState[key] = val;
          mirrorMap.delete(key);
          return;
        }
        const newClone = JSON.parse(JSON.stringify(val)) as Record<string, unknown>;
        const existingMirror = mirrorMap.get(key);
        if (existingMirror !== undefined) {
          // Update in-place: refs from toRefs(state.value) stay valid, Vue detects each change.
          isSyncing = true;
          try {
            for (const k of Object.keys(existingMirror)) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              if (!(k in newClone)) delete existingMirror[k];
            }
            for (const k of Object.keys(newClone)) {
              if (existingMirror[k] !== newClone[k]) existingMirror[k] = newClone[k];
            }
          } finally {
            isSyncing = false;
          }
        } else {
          const mirror = makeReactiveMirror(newClone, key) as Record<string, unknown>;
          mirrorMap.set(key, mirror);
          reactiveState[key] = mirror;
        }
      } catch {
        reactiveState[key] = val;
      }
    };

    const syncFromBridge = (changedKey?: string) => {
      if (changedKey !== undefined) {
        syncKey(changedKey);
      } else {
        Object.keys(bridge.state as Record<string, unknown>).forEach(syncKey);
      }
    };

    syncFromBridge();
    nuxtApp.payload.state = reactiveState;

    const unsubscribe = bridge.subscribe(syncFromBridge);

    nuxtApp.hook('page:finish', () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('__preview');
      const path = url.pathname + url.search + (url.hash || '');
      if (typeof bridge.onIframeNavigate === 'function') bridge.onIframeNavigate(path);
    });

    window.addEventListener('beforeunload', () => {
      unsubscribe();
    });
  },
});