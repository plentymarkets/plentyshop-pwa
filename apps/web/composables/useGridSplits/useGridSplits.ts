export const useGridSplits = (options: {
  columnWidths: Ref<number[]>;
  emit: (event: 'update:columnWidths', value: number[]) => void;
}) => {
  const steps = Array.from({ length: 12 }, (_, i) => i + 1);
  const splits = Array.from({ length: 11 }, (_, i) => i + 1);

  const squaresContainer = ref<HTMLElement | null>(null);
  const isDragging = ref(false);
  const containerWidth = ref(0);
  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    setTimeout(() => {
      if (squaresContainer.value) {
        containerWidth.value = squaresContainer.value.offsetWidth;
        resizeObserver = new ResizeObserver(() => {
          containerWidth.value = squaresContainer.value?.offsetWidth || 0;
        });
        resizeObserver.observe(squaresContainer.value);
      }
    }, 50);
  });

  onBeforeUnmount(() => {
    if (resizeObserver && squaresContainer.value) {
      resizeObserver.unobserve(squaresContainer.value);
      resizeObserver.disconnect();
    }
  });

  const splitIndex = computed({
    get: () => options.columnWidths.value?.[0] || 6,
    set: (val: number) => {
      const columns = options.columnWidths.value.length;
      const firstColWidth = Math.max(1, Math.min(val, 11));
      if (columns === 2) {
        options.emit('update:columnWidths', [firstColWidth, 12 - firstColWidth]);
      }
    },
  });

  const updateSplitFromEvent = (e: MouseEvent) => {
    const container = squaresContainer.value;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const stepWidth = rect.width / steps.length;
    let split = Math.round(x / stepWidth);
    split = Math.max(1, Math.min(split, splits.length));
    splitIndex.value = split;
  };

  const handlePointerDown = (e: MouseEvent) => {
    isDragging.value = true;
    updateSplitFromEvent(e);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
  };

  const handlePointerMove = (e: MouseEvent) => {
    if (isDragging.value) {
      updateSplitFromEvent(e);
    }
  };

  const handlePointerUp = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', handlePointerMove);
    window.removeEventListener('mouseup', handlePointerUp);
  };

  const arrowStyle = computed(() => {
    const width = containerWidth.value;
    const stepWidth = width / steps.length;
    const arrowWidth = 16;
    const left = stepWidth * splitIndex.value - arrowWidth / 2;
    return { left: `${left}px` };
  });

  const getStepBorderClass = (step: number) => {
    if (step === splitIndex.value) return 'border-r-[1.5px] border-r-primary-500';
    if (step === splitIndex.value + 1) return 'border-l-[1.5px] border-l-primary-500';
  };

  const onInput = (e: Event) => {
    splitIndex.value = Number((e.target as HTMLInputElement).value);
  };

  return {
    steps,
    splits,
    squaresContainer,
    splitIndex,
    updateSplitFromEvent,
    handlePointerDown,
    arrowStyle,
    getStepBorderClass,
    onInput,
  };
};
