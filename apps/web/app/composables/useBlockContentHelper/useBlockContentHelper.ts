export const useBlockContentHelper = () => {
  const viewport = useViewport();

  const hexToRgba = (hex: string = '#fff', opacity: number = 1) => {
    const cleanHex = hex.replace('#', '');

    const fullHex =
      cleanHex.length === 3
        ? cleanHex
            .split('')
            .map((c) => c + c)
            .join('')
        : cleanHex;

    const red = parseInt(fullHex.substring(0, 2), 16);
    const green = parseInt(fullHex.substring(2, 4), 16);
    const blue = parseInt(fullHex.substring(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  };

  const getImageHeight = () => {
    switch (viewport.breakpoint.value) {
      case '4xl': {
        return '768px';
      }

      case 'lg': {
        return '576px';
      }
      case 'md': {
        return '432px';
      }
      default: {
        return '320px';
      }
    }
  };

  const getTextAlignment = (textAlignment: string) => {
    switch (textAlignment) {
      case 'center': {
        return 'center';
      }
      case 'right': {
        return 'right';
      }
      default: {
        return 'left';
      }
    }
  };

  const isMobile = computed(() => viewport.isLessThan('lg'));

  const getContentPosition = (axis: string) => {
    if (isMobile.value) {
      return 'center';
    }

    switch (axis) {
      case 'center': {
        return 'center';
      }
      case 'right': {
        return 'flex-end';
      }
      case 'bottom': {
        return 'flex-end';
      }
      default: {
        return 'flex-start';
      }
    }
  };

  return {
    hexToRgba,
    getImageHeight,
    getTextAlignment,
    getContentPosition,
    isMobile,
  };
};
