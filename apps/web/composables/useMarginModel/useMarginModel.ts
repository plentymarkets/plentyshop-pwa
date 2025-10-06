export const useMarginModel = (layout: {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}) => {
  const safeLayout = computed(() => ({
    marginTop: layout.marginTop ?? 0,
    marginBottom: layout.marginBottom ?? 0,
    marginLeft: layout.marginLeft ?? 0,
    marginRight: layout.marginRight ?? 0,
  }));

  return reactive({
    get marginTop() {
      return safeLayout.value.marginTop;
    },
    set marginTop(val: number) {
      layout.marginTop = val;
    },
    get marginBottom() {
      return safeLayout.value.marginBottom;
    },
    set marginBottom(val: number) {
      layout.marginBottom = val;
    },
    get marginLeft() {
      return safeLayout.value.marginLeft;
    },
    set marginLeft(val: number) {
      layout.marginLeft = val;
    },
    get marginRight() {
      return safeLayout.value.marginRight;
    },
    set marginRight(val: number) {
      layout.marginRight = val;
    },
  });
};
