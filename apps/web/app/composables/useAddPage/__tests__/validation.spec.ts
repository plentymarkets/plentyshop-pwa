import { pageNameSchema } from '../validation';

describe('pageNameSchema', () => {
  it('should reject names consisting only of numbers', async () => {
    const result = await pageNameSchema.isValid('12345');
    expect(result).toBe(false);
  });

  it('should accept names with letters', async () => {
    expect(await pageNameSchema.isValid('My Page')).toBe(true);
    expect(await pageNameSchema.isValid('Page123')).toBe(true);
  });
});
