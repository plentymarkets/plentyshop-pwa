import {
  createFooterContainer,
  isLegacyFooterBlock,
  migrateLegacyFooterToContainer,
} from '~/utils/blockTemplates/footer/factory';
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

  it('should have a MultiGrid with five TextCard columns', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    expect(Array.isArray(columns)).toBe(true);
    expect(columns).toHaveLength(5);
    columns.forEach((col) => expect(col.name).toBe('TextCard'));
  });

  it('should assign parent_slot 0–4 to the five column blocks', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    columns.forEach((col, i) => {
      expect((col as Block & { parent_slot: number }).parent_slot).toBe(i);
    });
  });

  it('should have MultiGrid with five equal column widths', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const config = multiGrid?.configuration as unknown as { columnWidths: number[] };
    expect(config?.columnWidths).toEqual([3, 3, 3, 3, 3]);
  });

  it('should have color configuration in footer container', () => {
    const footer = createFooterContainer();
    expect(footer.configuration?.colors?.background).toBeDefined();
    expect(footer.configuration?.colors?.text).toBeDefined();
  });

  it('should have a button with cancellation form link in the fifth column', () => {
    const footer = createFooterContainer();
    const multiGrid = (footer.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    const lastColumn = columns[4];
    const button = (lastColumn?.content as { button: { label: string; link: string } }).button;
    expect(button.link).toBe(paths.cancellationForm);
    expect(button.label).toBeTruthy();
  });
});

describe('migrateLegacyFooterToContainer', () => {
  const legacyFooter: Block = {
    name: 'Footer',
    type: 'content',
    parent_slot: undefined,
    meta: {
      uuid: 'a869b13b-04bd-42cb-9b97-72d0e22df003',
      isGlobalTemplate: true,
    },
    content: {
      colors: {
        background: '#cfe4ec',
        footnoteBackground: '#161a16',
        footnoteText: '#959795',
        text: '#1c1c1c',
      },
      column1: {
        showCancellationForm: true,
        showCancellationRights: true,
        showDeclarationOfAccessibility: true,
        showLegalDisclosure: true,
        showPrivacyPolicy: true,
        showTermsAndConditions: false,
        title: 'Legal',
      },
      column2: {
        description: '',
        showContactLink: true,
        showRegisterLink: true,
        title: 'Services',
      },
      column3: { description: '', title: '' },
      column4: { description: '', title: '' },
      footnote: '© Green Shop 2026',
      footnoteAlign: 'right',
    },
  };

  it('should detect legacy Footer block', () => {
    expect(isLegacyFooterBlock(legacyFooter)).toBe(true);
  });

  it('should not detect a FooterContainer as legacy', () => {
    expect(isLegacyFooterBlock(createFooterContainer())).toBe(false);
  });

  it('should produce a FooterContainer structure block', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    expect(migrated.name).toBe('FooterContainer');
    expect(migrated.type).toBe('structure');
    expect(Array.isArray(migrated.content)).toBe(true);
    expect(migrated.content).toHaveLength(2);
    expect((migrated.content as Block[])[0]?.name).toBe('MultiGrid');
    expect((migrated.content as Block[])[1]?.name).toBe('TextCard');
  });

  it('should map background and text colors to the container configuration', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    expect(migrated.configuration?.colors?.background).toBe('#cfe4ec');
    expect(migrated.configuration?.colors?.text).toBe('#1c1c1c');
  });

  it('should produce five column TextCards with parent_slot 0–4', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const multiGrid = (migrated.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    expect(columns).toHaveLength(5);
    columns.forEach((col, i) => {
      expect(col.name).toBe('TextCard');
      expect((col as Block & { parent_slot: number }).parent_slot).toBe(i);
    });
  });

  it('should include only the legal switches that are true and skip showTermsAndConditions=false', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const multiGrid = (migrated.content as Block[])[0];
    const column1 = (multiGrid?.content as Block[])[0];
    const html = (column1?.content as { text: { htmlDescription: string } }).text.htmlDescription as string;

    expect(html).toContain('Legal');
    expect(html).toContain(paths.cancellationRights);
    expect(html).toContain(paths.declarationOfAccessibility);
    expect(html).toContain(paths.legalDisclosure);
    expect(html).toContain(paths.privacyPolicy);
    expect(html).not.toContain(paths.termsAndConditions);
  });

  it('should include both services switches in column 2', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const multiGrid = (migrated.content as Block[])[0];
    const column2 = (multiGrid?.content as Block[])[1];
    const html = (column2?.content as { text: { htmlDescription: string } }).text.htmlDescription as string;

    expect(html).toContain('Services');
    expect(html).toContain(paths.contact);
    expect(html).toContain(paths.register);
  });

  it('should produce empty column TextCards for columns 3 and 4 with no title and no flags', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const multiGrid = (migrated.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    const html3 = (columns[2]?.content as { text: { htmlDescription: string } }).text.htmlDescription as string;
    const html4 = (columns[3]?.content as { text: { htmlDescription: string } }).text.htmlDescription as string;

    expect(html3).toBe('');
    expect(html4).toBe('');
  });

  it('should map footnote text, alignment and colors to the footnote TextCard', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const footnote = (migrated.content as Block[])[1];
    const content = footnote?.content as {
      text: { htmlDescription: string; textAlignment: string; color: string };
      layout: { backgroundColor: string };
    };

    expect(content.text.htmlDescription).toBe('© Green Shop 2026');
    expect(content.text.textAlignment).toBe('right');
    expect(content.text.color).toBe('#959795');
    expect(content.layout.backgroundColor).toBe('#161a16');
  });

  it('should fall back to defaults when legacy content is missing fields', () => {
    const partial: Block = {
      name: 'Footer',
      type: 'content',
      meta: { uuid: 'partial-uuid' },
      content: {},
    };

    const migrated = migrateLegacyFooterToContainer(partial);
    expect(migrated.configuration?.colors?.background).toBe('#cfe4ec');
    expect(migrated.configuration?.colors?.text).toBe('#1c1c1c');

    const footnote = (migrated.content as Block[])[1];
    const content = footnote?.content as {
      text: { textAlignment: string; color: string };
      layout: { backgroundColor: string };
    };
    expect(content.text.textAlignment).toBe('right');
    expect(content.text.color).toBe('#8b8d8b');
    expect(content.layout.backgroundColor).toBe('#161a16');
  });

  it('should have a button with cancellation form link in the fifth column', () => {
    const migrated = migrateLegacyFooterToContainer(legacyFooter);
    const multiGrid = (migrated.content as Block[])[0];
    const columns = multiGrid?.content as Block[];
    const lastColumn = columns[4];
    const button = (lastColumn?.content as { button: { label: string; link: string } }).button;
    expect(button.link).toBe(paths.cancellationForm);
    expect(button.label).toBeTruthy();
  });
});
