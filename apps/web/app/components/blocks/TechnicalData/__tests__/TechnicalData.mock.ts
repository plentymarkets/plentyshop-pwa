import type { TechnicalDataProps } from '../types';

export const TechnicalDataMock: TechnicalDataProps = {
  name: 'TechnicalData',
  type: 'content',
  meta: {
    uuid: 'b1a2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c522',
  },
  content: {
    text: {
      title: 'Technical Data',
    },
    layout: {
      displayAsCollapsable: true,
      initiallyCollapsed: true,
      paddingTop: 10,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
