const EXCLUDED_STATE_KEYS = new Set<string>([
  '$sviewportState',
]);

type TickListener = () => void;

interface EditorBridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pinia: any;
  state: Record<string, unknown>;
  listeners: Set<TickListener>;
  notify: () => void;
  subscribe: (fn: TickListener) => () => void;
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
      const notify = () => {
        listeners.forEach((fn) => {
          try {
            fn();
          } catch {
            /* ignore */
          }
        });
      };

      Object.keys(nuxtApp.payload.state).forEach((key) => {
        if (EXCLUDED_STATE_KEYS.has(key)) return;
        wrapDeepReactive((nuxtApp.payload.state as Record<string, unknown>)[key], notify);
      });

      const originalState = nuxtApp.payload.state as Record<string, unknown>;
      nuxtApp.payload.state = new Proxy(originalState, {
        set(target, prop: string, value) {
          target[prop] = value;
          if (!EXCLUDED_STATE_KEYS.has(prop)) {
            wrapDeepReactive(value, notify);
            notify();
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


    const makeReactiveMirror = (clonedVal: unknown, bridgeKey: string): unknown => {
      if (clonedVal === null || typeof clonedVal !== 'object' || Array.isArray(clonedVal)) {
        return clonedVal;
      }
      return reactive(
        new Proxy(clonedVal as Record<string, unknown>, {
          set(target, prop: string, value) {
            Reflect.set(target, prop, value);
            try {
              const parentTarget = (bridge.state as Record<string, unknown>)[bridgeKey];
              if (parentTarget !== null && typeof parentTarget === 'object') {
                (parentTarget as Record<string, unknown>)[prop] = value;
              }
            } catch { /* ignore */ }
            return true;
          },
        }),
      );
    };

    const existingState = nuxtApp.payload.state as Record<string, unknown>;
    const reactiveState = shallowReactive({ ...existingState });

    const syncFromBridge = () => {
      const bridgeState = bridge.state as Record<string, unknown>;
      Object.keys(bridgeState).forEach((key) => {
        if (EXCLUDED_STATE_KEYS.has(key)) return;
        const val = bridgeState[key];
        try {
          const clone =
            val === null || typeof val !== 'object' ? val : JSON.parse(JSON.stringify(val));
          reactiveState[key] = makeReactiveMirror(clone, key);
        } catch {
          reactiveState[key] = val;
        }
      });
    };

    syncFromBridge();
    nuxtApp.payload.state = reactiveState;

    const unsubscribe = bridge.subscribe(syncFromBridge);
    window.addEventListener('beforeunload', () => {
      unsubscribe();
    });
  },
});