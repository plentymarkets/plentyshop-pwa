import { describe, it, expect } from 'vitest';
import { ref, computed, type Ref } from 'vue';
import { useFullWidthToggle } from '../useFullWidthToggle';

describe('useFullWidthToggle', () => {
  it('should return false when layout is undefined', () => {
    const block = ref<{ name: string; layout?: { fullWidth?: boolean } }>({ name: 'TestBlock' });
    const { isFullWidth } = useFullWidthToggle(block);

    expect(isFullWidth.value).toBe(false);
  });

  it('should return false when layout.fullWidth is undefined', () => {
    const block = ref({
      name: 'TestBlock',
      layout: {},
    });
    const { isFullWidth } = useFullWidthToggle(block);

    expect(isFullWidth.value).toBe(false);
  });

  it('should return true when layout.fullWidth is true', () => {
    const block = ref({
      name: 'TestBlock',
      layout: { fullWidth: true },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    expect(isFullWidth.value).toBe(true);
  });

  it('should return false when layout.fullWidth is false', () => {
    const block = ref({
      name: 'TestBlock',
      layout: { fullWidth: false },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    expect(isFullWidth.value).toBe(false);
  });

  it('should work with blocks containing other properties', () => {
    const block = ref({
      name: 'TestBlock',
      content: { text: 'Hello' },
      configuration: { enabled: true },
      layout: { fullWidth: true },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    expect(isFullWidth.value).toBe(true);
    expect(block.value.content).toEqual({ text: 'Hello' });
    expect(block.value.configuration).toEqual({ enabled: true });
  });

  it('should handle setting fullWidth to false explicitly', () => {
    const block = ref<{ name: string; layout?: { fullWidth?: boolean } }>({ name: 'TestBlock' });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = false;

    expect(block.value.layout).toBeDefined();
    expect(block.value.layout?.fullWidth).toBe(false);
  });

  it('should be reactive to external block mutations', () => {
    const block = ref({
      name: 'TestBlock',
      layout: { fullWidth: false },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    block.value.layout.fullWidth = true;

    expect(isFullWidth.value).toBe(true);
  });

  it('should handle blocks with nested layout structures', () => {
    const block = ref({
      name: 'TestBlock',
      layout: {
        fullWidth: false,
        margin: { top: 10, bottom: 20 },
        padding: { left: 5, right: 5 },
      },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;

    expect(block.value.layout.fullWidth).toBe(true);
    expect(block.value.layout.margin).toEqual({ top: 10, bottom: 20 });
    expect(block.value.layout.padding).toEqual({ left: 5, right: 5 });
  });

  it('should work with multiple instances on different blocks', () => {
    const block1 = ref({ name: 'Block1', layout: { fullWidth: false } });
    const block2 = ref({ name: 'Block2', layout: { fullWidth: true } });

    const { isFullWidth: isFullWidth1 } = useFullWidthToggle(block1);
    const { isFullWidth: isFullWidth2 } = useFullWidthToggle(block2);

    expect(isFullWidth1.value).toBe(false);
    expect(isFullWidth2.value).toBe(true);

    isFullWidth1.value = true;

    expect(isFullWidth1.value).toBe(true);
    expect(isFullWidth2.value).toBe(true);
    expect(block1.value.layout.fullWidth).toBe(true);
    expect(block2.value.layout.fullWidth).toBe(true);
  });

  it('should maintain reactivity when block reference changes', () => {
    const initialBlock = { name: 'TestBlock', layout: { fullWidth: false } };
    const block = ref(initialBlock);
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;
    expect(block.value.layout.fullWidth).toBe(true);

    block.value = { name: 'NewBlock', layout: { fullWidth: false } };
    expect(isFullWidth.value).toBe(false);

    isFullWidth.value = true;
    expect(block.value.layout.fullWidth).toBe(true);
  });

  it('should initialize layout object when setting fullWidth on a block without layout', () => {
    const block = ref<{ name: string; layout?: { fullWidth?: boolean } }>({ name: 'TestBlock' });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;

    expect(block.value.layout).toBeDefined();
    expect(block.value.layout?.fullWidth).toBe(true);
  });

  it('should update fullWidth value when layout exists', () => {
    const block = ref({
      name: 'TestBlock',
      layout: { fullWidth: false },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;

    expect(block.value.layout.fullWidth).toBe(true);
  });

  it('should toggle fullWidth value multiple times', () => {
    const block = ref({
      name: 'TestBlock',
      layout: { fullWidth: false },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;
    expect(isFullWidth.value).toBe(true);

    isFullWidth.value = false;
    expect(isFullWidth.value).toBe(false);

    isFullWidth.value = true;
    expect(isFullWidth.value).toBe(true);
  });

  it('should work with computed ref blocks', () => {
    const baseBlock: Ref<{ name: string; layout: { fullWidth: boolean } }> = ref({
      name: 'TestBlock',
      layout: { fullWidth: false },
    });
    const computedBlock = computed(() => baseBlock.value);
    const { isFullWidth } = useFullWidthToggle(computedBlock);

    isFullWidth.value = true;

    expect(computedBlock.value.layout.fullWidth).toBe(true);
    expect(baseBlock.value.layout.fullWidth).toBe(true);
  });

  it('should preserve other layout properties when updating fullWidth', () => {
    const block = ref({
      name: 'TestBlock',
      layout: {
        fullWidth: false,
        marginTop: 10,
        backgroundColor: '#fff',
      },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;

    expect(block.value.layout.fullWidth).toBe(true);
    expect(block.value.layout.marginTop).toBe(10);
    expect(block.value.layout.backgroundColor).toBe('#fff');
  });

  it('should work with blocks containing other properties', () => {
    const block = ref({
      name: 'TestBlock',
      content: { text: 'Hello' },
      configuration: { enabled: true },
      layout: { fullWidth: false },
    });
    const { isFullWidth } = useFullWidthToggle(block);

    isFullWidth.value = true;

    expect(isFullWidth.value).toBe(true);
    expect(block.value.content).toEqual({ text: 'Hello' });
    expect(block.value.configuration).toEqual({ enabled: true });
  });
});
