export function stripInlineFontSizesFromHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const all = doc.body.querySelectorAll<HTMLElement>('*');
  all.forEach((element) => {
    if (element.tagName.toLowerCase() === 'font') {
      element.removeAttribute('size');
    }

    const style = element.getAttribute('style');
    if (!style) return;

    const cleanedStyle = style
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .filter((declaration) => !/^font-size\s*:/.test(declaration.toLowerCase()))
      .join('; ');

    if (cleanedStyle) element.setAttribute('style', cleanedStyle);
    else element.removeAttribute('style');
  });

  return doc.body.innerHTML;
}
