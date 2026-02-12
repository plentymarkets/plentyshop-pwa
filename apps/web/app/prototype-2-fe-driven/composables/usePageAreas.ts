import type { Block } from '@plentymarkets/shop-api';
import { mockPageAreasResponse } from '~/prototype-2-fe-driven/mocks/areaMocks';

interface PageAreas {
  header: Block[];
  main: Block[];
  footer: Block[];
}

export const usePageAreas = () => {
  const areas = useState<PageAreas>('page-areas', () => ({
    header: mockPageAreasResponse.data,
    main: [],
    footer: [],
  }));

  return {
    areas: readonly(areas),
  };
};
