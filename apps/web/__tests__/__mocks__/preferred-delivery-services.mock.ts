import type { PreferredDeliveryServicesData } from '@plentymarkets/shop-api';
import { expect } from 'vitest';

export const PreferredDeliveryServicesMock = {
  preferredLocation: expect.any(Boolean),
  preferredNeighbour: expect.any(Boolean),
  additionalCharge: expect.any(Number),
  preferredDay: expect.any(Object) as unknown as
    | {
        [key: string]: {
          date: string;
          dayName: string;
          dayNumber: string;
        };
      }
    | boolean,
} as unknown as PreferredDeliveryServicesData;
