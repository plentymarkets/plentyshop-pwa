# Blocks saving

This article explains how block data is persisted in PlentyONE Shop.

Saving persists the current editor state to the backend.
The save payload is the full block tree serialised as a JSON string.
Both page-specific blocks and global blocks (header, footer) are handled in a single request.

## After a successful save

1. The response is re-assembled to normalise any backend transformations.
2. Both `data` and `cleanData` are updated from the response, resetting the dirty state.
3. The editor disables the save button until the next change.

Global blocks saved on the homepage propagate to all pages, since every page reads the same global block data.

## Related resources

Linked concepts

1. [Blocks architecture](/guide/concept/blocks-architecture.md) — Overview of the blocks system and data flow
2. [Global blocks vs. non-global blocks](/guide/concept/blocks-global-vs-non-global.md) — How global block propagation works
