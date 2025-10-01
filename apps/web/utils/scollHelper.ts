export const scrollToHTMLObject = (object: string, withOffset: boolean = true) => {
  let offset = 20;
  const element = document.querySelector(object) as HTMLElement;
  const elementOffset = element?.offsetTop ?? 0;

  if (withOffset) {
    const headerElement = document.querySelector('header') as HTMLElement;
    offset = headerElement?.offsetHeight ?? 0;
  }

  window.scrollTo({
    top: elementOffset - offset,
    behavior: 'smooth',
  });
};
