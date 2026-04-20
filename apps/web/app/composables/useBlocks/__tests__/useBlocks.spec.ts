import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { GetBlocksResponse } from '@plentymarkets/shop-api';
import { useBlocks } from '../useBlocks';

const { useSdk } = vi.hoisted(() => ({
  useSdk: vi.fn(),
}));

const { useAsyncData } = vi.hoisted(() => ({
  useAsyncData: vi.fn(),
}));

const { useState } = vi.hoisted(() => ({
  useState: vi.fn(),
}));

const { useNuxtApp } = vi.hoisted(() => ({
  useNuxtApp: vi.fn(),
}));

const { useEditor } = vi.hoisted(() => ({
  useEditor: vi.fn(),
}));

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useAsyncData', () => useAsyncData);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useNuxtApp', () => useNuxtApp);
mockNuxtImport('useEditor', () => useEditor);

const emptyResponse = (): GetBlocksResponse =>
  ({ blocks: [], HeaderContainer: undefined, Footer: undefined }) as unknown as GetBlocksResponse;

describe('useBlocks — isSettling', () => {
  let isEditingEnabled: { value: boolean };

  beforeEach(() => {
    vi.useFakeTimers();

    useState.mockReturnValue(
      ref({
        data: emptyResponse(),
        cleanData: emptyResponse(),
        defaultTemplateData: [],
        loading: false,
        isSettling: false,
      }),
    );

    isEditingEnabled = { value: true };
    useEditor.mockReturnValue({ isEditingEnabled });

    useNuxtApp.mockReturnValue({
      $i18n: {
        locale: { value: 'en' },
        te: vi.fn().mockReturnValue(false),
        t: vi.fn().mockImplementation((key: string) => key),
      },
      _settleTimer: null,
    });

    useSdk.mockReturnValue({
      plentysystems: { getBlocksWithGlobalBlocks: vi.fn() },
    });

    useAsyncData.mockImplementation(() => ({
      data: { value: { data: emptyResponse() } },
      error: { value: null },
    }));
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('is false before any fetchBlocks call', () => {
    const { isSettling } = useBlocks();
    expect(isSettling.value).toBe(false);
  });

  it('becomes true immediately after fetchBlocks resolves (before the timer fires)', async () => {
    const { isSettling, fetchBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');

    expect(isSettling.value).toBe(true);
  });

  it('becomes false once the 150ms settle timer fires', async () => {
    const { isSettling, fetchBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');
    expect(isSettling.value).toBe(true);

    vi.advanceTimersByTime(150);

    expect(isSettling.value).toBe(false);
  });

  it('does not settle before the full 150ms have elapsed', async () => {
    const { isSettling, fetchBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');
    vi.advanceTimersByTime(149);

    expect(isSettling.value).toBe(true);
  });

  it('takes a fresh snapshot of data into cleanData when the timer fires', async () => {
    const { fetchBlocks, data, cleanData, updateBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');

    // Simulate an in-flight mutation after fetch but before settle
    updateBlocks([{ name: 'Banner', type: 'content', content: { title: 'mutated' }, meta: { uuid: 'abc' } }]);

    vi.advanceTimersByTime(150);

    expect(JSON.stringify(cleanData.value)).toEqual(JSON.stringify(data.value));
  });

  it('sets isEditingEnabled to false when the timer fires', async () => {
    isEditingEnabled.value = true;
    const { fetchBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');
    vi.advanceTimersByTime(150);

    expect(isEditingEnabled.value).toBe(false);
  });

  it('debounces: a second fetchBlocks call before 150ms resets the settle window', async () => {
    const { isSettling, fetchBlocks } = useBlocks();

    await fetchBlocks('index', 'immutable');
    vi.advanceTimersByTime(100); // 100ms into first window — not yet settled

    await fetchBlocks('index', 'immutable'); // restarts the 150ms window
    vi.advanceTimersByTime(100); // only 100ms into second window

    expect(isSettling.value).toBe(true); // still settling

    vi.advanceTimersByTime(50); // 150ms since second call

    expect(isSettling.value).toBe(false);
  });

  it('isSettling is shared across all useBlocks() callers', async () => {
    const a = useBlocks();
    const b = useBlocks();

    await a.fetchBlocks('index', 'immutable');

    expect(a.isSettling.value).toBe(true);
    expect(b.isSettling.value).toBe(true);

    vi.advanceTimersByTime(150);

    expect(a.isSettling.value).toBe(false);
    expect(b.isSettling.value).toBe(false);
  });
});
