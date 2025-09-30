export const useMarginModel = (layout: {
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}) => {
  const safeLayout = computed(() => ({
    marginTop: layout.marginTop ?? '0',
    marginBottom: layout.marginBottom ?? '0',
    marginLeft: layout.marginLeft ?? '0',
    marginRight: layout.marginRight ?? '0',
  }));

  return reactive({
    get marginTop() {
      return safeLayout.value.marginTop;
    },
    set marginTop(val: string) {
      layout.marginTop = val;
    },
    get marginBottom() {
      return safeLayout.value.marginBottom;
    },
    set marginBottom(val: string) {
      layout.marginBottom = val;
    },
    get marginLeft() {
      return safeLayout.value.marginLeft;
    },
    set marginLeft(val: string) {
      layout.marginLeft = val;
    },
    get marginRight() {
      return safeLayout.value.marginRight;
    },
    set marginRight(val: string) {
      layout.marginRight = val;
    },
  });
};
