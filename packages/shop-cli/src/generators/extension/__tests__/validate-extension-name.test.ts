import { describe, it, expect } from 'vitest';
import { validateExtensionName } from '../../../utils/validation';

describe('validateExtensionName', () => {
  it('should accept a scoped kebab-case name', () => {
    expect(validateExtensionName('@plentymarkets/four-seasons')).toBe(true);
  });

  it.each(['four-seasons', '@scope', '@scope/', '@Scope/name', '@scope/Name', '@scope/na me', ''])(
    'should reject "%s"',
    (name) => {
      expect(validateExtensionName(name)).not.toBe(true);
    },
  );
});
