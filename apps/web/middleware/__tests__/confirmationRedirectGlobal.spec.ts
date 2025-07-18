import { matchOldConfirmationUrl } from '~/middleware/confirmation-redirect.global';

describe('matchOldConfirmationUrl', () => {
  const testCases = [
    // without language prefix
    { path: '/-/akQQABC123/idQQ456789.html', expected: { orderAccessKey: 'ABC123', orderId: '456789' } },
    { path: '/-/akQQABC123/idQQ456789', expected: { orderAccessKey: 'ABC123', orderId: '456789' } },
    { path: '/_py-/akQQXYZ987/idQQ123456.html', expected: { orderAccessKey: 'XYZ987', orderId: '123456' } },
    { path: '/_py-/akQQXYZ987/idQQ123456', expected: { orderAccessKey: 'XYZ987', orderId: '123456' } },
    { path: '/_py_/akQQPQR123/idQQ789000.html', expected: { orderAccessKey: 'PQR123', orderId: '789000' } },
    { path: '/_py_/akQQPQR123/idQQ789000', expected: { orderAccessKey: 'PQR123', orderId: '789000' } },
    { path: '/_plentyShop__/akQQLMN321/idQQ654321.html', expected: { orderAccessKey: 'LMN321', orderId: '654321' } },
    { path: '/_plentyShop__/akQQLMN321/idQQ654321', expected: { orderAccessKey: 'LMN321', orderId: '654321' } },

    // with language prefix
    { path: '/de/-/akQQABC123/idQQ456789.html', expected: { lang: 'de', orderAccessKey: 'ABC123', orderId: '456789' } },
    { path: '/en/_py-/akQQXYZ987/idQQ123456', expected: { lang: 'en', orderAccessKey: 'XYZ987', orderId: '123456' } },
    {
      path: '/fr/_plentyShop__/akQQLANG789/idQQ888888',
      expected: { lang: 'fr', orderAccessKey: 'LANG789', orderId: '888888' },
    },

    // with ending slash
    {
      path: '/de/_py-/akQQTRAIL123/idQQ999999/',
      expected: { lang: 'de', orderAccessKey: 'TRAIL123', orderId: '999999' },
    },

    // invalid paths
    { path: '/some/invalid/path', expected: null },
    { path: '/akQQmissingPrefix/idQQ123', expected: null },
    { path: '/de/akQQX/idQQabc', expected: null },
  ];

  testCases.forEach(({ path, expected }) => {
    it(`should parse ${path} correctly`, () => {
      const result = matchOldConfirmationUrl(path);
      expect(result).toEqual(expected);
    });
  });
});
