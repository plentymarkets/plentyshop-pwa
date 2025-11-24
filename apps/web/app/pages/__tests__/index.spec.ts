import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('index.vue', () => {
    const indexPagePath = join(__dirname, '../index.vue');

    describe('Page Meta Configuration', () => {
        it('should have newsletter-confirmation-client middleware registered in definePageMeta', () => {
            expect(existsSync(indexPagePath)).toBe(true);

            const fileContent = readFileSync(indexPagePath, 'utf-8');

            expect(fileContent).toContain('definePageMeta');
            expect(fileContent).toContain('middleware:');
            expect(fileContent).toContain('newsletter-confirmation-client');
        });
    });
});
