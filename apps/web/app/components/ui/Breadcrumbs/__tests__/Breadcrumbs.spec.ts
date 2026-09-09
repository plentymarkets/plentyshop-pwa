import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { UiBreadcrumbs } from '#components';

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);

const routeRef = reactive({ path: '/' });
const { useRouteMock } = vi.hoisted(() => ({ useRouteMock: vi.fn(() => routeRef) }));
mockNuxtImport('useRoute', () => useRouteMock);

const getCapturedJsonLdRaw = (): string => {
  const calls = mockUseHead.mock.calls;
  for (let i = calls.length - 1; i >= 0; i--) {
    const call = calls[i];
    if (!call) continue;
    const arg = call[0] as { script?: { type: string; innerHTML: unknown }[] };
    const script = arg?.script?.find((s) => s.type === 'application/ld+json');
    if (script) return unref(script.innerHTML) as string;
  }
  return '';
};

const getCapturedJsonLd = (): Record<string, unknown> => {
  const raw = getCapturedJsonLdRaw();
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
};

const getListItemId = (listItem: Record<string, unknown>): unknown =>
  (listItem['item'] as Record<string, unknown>)['@id'];
const getListItemPosition = (listItem: Record<string, unknown>): unknown => listItem['position'];

describe('<Breadcrumbs />', () => {
  beforeEach(() => {
    mockUseHead.mockClear();
    routeRef.path = '/';
  });

  it('should render component', () => {
    const { getByTestId } = mount(UiBreadcrumbs, {
      props: {
        breadcrumbs: [],
      },
    });

    expect(getByTestId('breadcrumbs'));
  });

  describe('BreadcrumbList JSON-LD', () => {
    it('should build slash-separated @id values for each nested path segment', () => {
      routeRef.path = '/women/clothing/dresses';

      mount(UiBreadcrumbs, { props: { breadcrumbs: [] } });

      const itemListElement = getCapturedJsonLd()['itemListElement'] as Array<Record<string, unknown>>;
      const ids = itemListElement.map(getListItemId);

      expect(ids).toEqual(['/', '/women/', '/women/clothing/', '/women/clothing/dresses/']);
    });

    it('should assign sequential, non-duplicate positions', () => {
      routeRef.path = '/women/clothing/dresses';

      mount(UiBreadcrumbs, { props: { breadcrumbs: [] } });

      const itemListElement = getCapturedJsonLd()['itemListElement'] as Array<Record<string, unknown>>;
      const positions = itemListElement.map(getListItemPosition);

      expect(positions).toEqual([1, 2, 3, 4]);
    });

    it('should only list the Home item for the root path', () => {
      routeRef.path = '/';

      mount(UiBreadcrumbs, { props: { breadcrumbs: [] } });

      const itemListElement = getCapturedJsonLd()['itemListElement'] as Array<Record<string, unknown>>;

      expect(itemListElement).toHaveLength(1);
      const [homeItem] = itemListElement;
      expect((homeItem?.['item'] as Record<string, unknown> | undefined)?.['@id']).toBe('/');
    });

    it('should escape unsafe characters in the JSON-LD innerHTML', () => {
      routeRef.path = '/<script>alert(1)</script>';

      mount(UiBreadcrumbs, { props: { breadcrumbs: [] } });

      const rawJsonLd = getCapturedJsonLdRaw();

      expect(rawJsonLd).not.toContain('</script>');
    });

    it('should update to match the new route after a client-side navigation, without remounting', async () => {
      routeRef.path = '/women';

      mount(UiBreadcrumbs, { props: { breadcrumbs: [] } });

      expect(getCapturedJsonLd()['itemListElement']).toHaveLength(2);

      routeRef.path = '/women/clothing/dresses';
      await nextTick();

      const itemListElement = getCapturedJsonLd()['itemListElement'] as Array<Record<string, unknown>>;
      expect(itemListElement.map(getListItemId)).toEqual([
        '/',
        '/women/',
        '/women/clothing/',
        '/women/clothing/dresses/',
      ]);
    });
  });
});
