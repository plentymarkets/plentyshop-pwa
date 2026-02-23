export const useStickyStack = () => {
  onMounted(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-sticky="true"]'));

    let offset = 0;
    blocks.forEach((el) => {
      el.style.position = 'sticky';
      el.style.top = `${offset}px`;
      offset += el.getBoundingClientRect().height;
    });
  });
};
