export function stripInlineFontSizesFromHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const all = doc.body.querySelectorAll<HTMLElement>('*');
  all.forEach((el) => {
    if (el.tagName.toLowerCase() === 'font') {
      el.removeAttribute('size');
    }

    const style = el.getAttribute('style');
    if (!style) return;

    const next = style
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((decl) => !/^font-size\s*:/.test(decl.toLowerCase()))
      .join('; ');

    if (next) el.setAttribute('style', next);
    else el.removeAttribute('style');
  });

  return doc.body.innerHTML;
}
