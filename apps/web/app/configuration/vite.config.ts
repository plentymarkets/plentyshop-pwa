import type { NormalizedOutputOptions, OutputBundle } from 'rollup';

export const FailOnLargeChunksPlugin = {
  name: 'fail-on-large-chunks',
  generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle) {
    if (!process.env.FAIL_BUILD_ON_LARGE_CHUNKS) {
      console.warn('Skipping chunk size check as FAIL_BUILD_ON_LARGE_CHUNKS is not set.');
      return;
    }
    // last update to 630 KB to allow codemirror bundle to be generated without manually chunking it.
    const LIMIT = 630 * 1024; // 630 KB
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (fileName === 'server.mjs') continue; // skip server bundle
      if (chunk.type === 'chunk' && chunk.code.length > LIMIT) {
        throw new Error(
          `❌ Chunk "${fileName}" is too large (${(chunk.code.length / 1024).toFixed(2)} KB). ` +
            `Limit is ${LIMIT / 1024} KB.`,
        );
      }
    }
  },
};
