import { createFooterContainer } from '~/utils/blockTemplates/footer/factory';
import type { Block } from '@plentymarkets/shop-api';

describe('createFooterContainer', () => {
  it('should create a FooterContainer block', () => {
    const footer = createFooterContainer();
    expect(footer).toBeDefined();
    expect(footer.name).toBe('FooterContainer');
  });

  it('should have correct block structure', () => {
    const footer = createFooterContainer();
    expect(footer).toHaveProperty('name');
    expect(footer).toHaveProperty('type');
    expect(footer).toHaveProperty('meta');
    expect(footer.meta).toHaveProperty('uuid');
    expect(footer).toHaveProperty('content');
    expect(footer).toHaveProperty('configuration');
  });

  it('should be a structure type block', () => {
    const footer = createFooterContainer();
    expect(footer.type).toBe('structure');
  });

  it('should be marked as global template', () => {
    const footer = createFooterContainer();
    expect(footer.meta.isGlobalTemplate).toBe(true);
  });

  it('should have two top-level children: MultiGrid and TextCard', () => {
    const footer = createFooterContainer();
    const content = footer.content as Block[];
    expect(Array.isArray(content)).toBe(true);
    expect(content).toHaveLength(2);
    expect(content[0]?.name).toBe('MultiGrid');
    expect(content[1]?.name).toBe('TextCard');
  });

  it('should have a MultiGrid with four TextCard columns', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    expect(Array.isArray(columns)).toBe(true);
    expect(columns).toHaveLength(4);
    columns.forEach((col) => expect(col.name).toBe('TextCard'));
  });

  it('should assign parent_slot 0–3 to the four column blocks', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    columns.forEach((col, i) => {
      expect((col as Block & { parent_slot: number }).parent_slot).toBe(i);
    });
  });

  it('should have MultiGrid with four equal column widths', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const config = multiGrid?.configuration as { columnWidths: number[] };
    expect(config?.columnWidths).toEqual([3, 3, 3, 3]);
  });

  it('should have color configuration in footer container', () => {
    const footer = createFooterContainer();
    expect(footer.configuration?.colors?.background).toBeDefined();
    expect(footer.configuration?.colors?.text).toBeDefined();
  });

  it('should mark all child blocks as global templates', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const footNote = (footer.content as Block[])[1];
    const columns = multiGrid?.content as Block[];

    expect(multiGrid?.meta.isGlobalTemplate).toBe(true);
    expect(footNote?.meta.isGlobalTemplate).toBe(true);
    columns.forEach((col) => expect(col.meta.isGlobalTemplate).toBe(true));
  });
});
