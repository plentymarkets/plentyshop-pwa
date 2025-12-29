import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TechnicalDataMock } from './TechnicalData.mock';
import TechnicalData from '../TechnicalData.vue';

describe('TechnicalData.vue', () => {
  it('should render technicaldata accordeon open if displayAsCollapsable and initallyCollapsed is true', async () => {
    const wrapper = mount(TechnicalData, {
      props: { ...TechnicalDataMock },
    });
    const isOpen =
      TechnicalDataMock.content?.layout.displayAsCollapsable && TechnicalDataMock.content?.layout.initiallyCollapsed;
    const technicalData = wrapper.find('[data-testid="technical-data-innertext"]');

    expect(technicalData.exists()).toBe(isOpen);
  });
  it('should render element with correct padding', () => {
    const wrapper = mount(TechnicalData, {
      props: { ...TechnicalDataMock },
    });
    const paddingTop = TechnicalDataMock.content?.layout.paddingTop;
    const technicalData = wrapper.find('[data-testid="technical-data-block"]');

    expect(technicalData.attributes('style')).toContain(`padding-top: ${paddingTop}px`);
  });
});
