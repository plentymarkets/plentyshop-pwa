# Footer - All Use Case Scenarios

**IMPORTANT:** Footer can ONLY be edited on the index page. On all other pages (product, category, etc.), Footer is read-only (displays from cache but cannot be modified).

## Page Load Scenarios

### Index Page - DE Locale

- API returns 0 blocks
- Uses default template with 7 blocks
- Footer displays from cache

### Index Page - EN Locale

- API returns 7 blocks including Footer
- Footer UUID from API differs from cache
- System syncs cache Footer to page state
- Footer displays from cache

### Product Page - DE Locale

- API returns 0 blocks
- Uses product template with 6 blocks (NO Footer)
- Cache NOT overwritten
- Footer displays from cache

### Product Page - EN Locale

- API returns product blocks (NO Footer)
- Cache NOT overwritten
- Footer displays from cache

### Category Page - DE/EN Locale

- May have own template with/without Footer
- If template has Footer → cache updated
- If template has NO Footer → cache unchanged
- Footer always displays from cache

## Editing Scenarios

### Edit Footer on Index Page

- User edits Footer (only editable on index page)
- Cache updated
- Page state.data updated via watcher
- Save button enables
- User saves
- Save button disables

## Locale Switch Scenarios

### Switch DE → EN

- Caches cleared
- Plugin refetches for EN locale
- API returns EN blocks with Footer
- Page re-renders with EN content
- Footer displays EN content

### Switch EN → DE

- Caches cleared
- Plugin refetches for DE locale
- API returns 0 blocks
- Plugin creates default Footer
- Page re-renders with DE content
- Footer displays DE content

### Locale Switch on Product Page

- Same cache clear/refetch process
- Product page re-renders
- Cache populated with new locale Footer
- Footer displays new locale

### Rapid Locale Switching

- User switches DE → EN → DE quickly
- Each switch clears and refetches
- Last locale wins
- No mixed content

## Navigation Scenarios

### Index → Product → Index (same locale)

- Footer persists in cache
- Product page doesn't overwrite cache
- Footer displays on all pages (read-only on product)
- No unnecessary refetches

### Product → Category → Product (same locale)

- Footer persists in cache
- Footer displays consistently (read-only)
- Cache may update if category has Footer in template

### Index → Edit Footer → Navigate to Product → Back to Index

- Edit Footer on index page
- Cache updated
- Navigate to product page
- Product displays Footer from cache (read-only)
- Navigate back to index
- Index shows edited Footer
- Index save button still enabled

### Navigate with Unsaved Changes (from Index)

- User edits Footer on index
- User tries to navigate away
- Guard prompts: "You have unsaved changes"
- User chooses: discard or stay

### Browser Back/Forward Navigation

- Footer persists across navigation
- Cache maintained (unless full reload)

## Edge Case Scenarios

### API Error During Plugin Load

- Plugin API call fails
- Cache set to empty array
- Page loads
- If page template has Footer → cache populated
- If page template has NO Footer → no Footer displayed
- App doesn't crash

### UUID Mismatch

- EN API returns Footer with UUID-A
- Cache has Footer with UUID-A
- Page template has Footer with UUID-B
- System detects mismatch
- Syncs cache Footer (UUID-A) to page state
- Both state.data and cleanData get UUID-A
- No false dirty state

### Readonly Errors

- Without deep cloning: direct assignment causes errors
- System uses deep clone when syncing
- No readonly errors occur

### Multiple Rapid Footer Edits

- User edits Footer 5+ times quickly on index page
- Each edit updates cache
- Watcher syncs each change to state
- Final state reflects last edit
- Save button enabled

### Page with No Data

- Page has no API response
- Page has no default template
- Page state empty
- Cache unchanged (still has Footer from plugin)
- Footer displays from cache
- No main content displayed

### Save During Locale Switch

- User edits Footer on index (EN locale)
- User clicks save
- While saving, user switches to DE
- Save completes for EN
- Frontend shows DE Footer
- No data corruption

### Race Condition (plugin parallel)

- If plugin runs in parallel
- Page may render before cache ready
- Footer missing
- Hydration mismatch
- Prevention: plugin parallel: false

## Critical Scenarios (Must Work)

1. **Footer visible on ALL pages** (index, category, product)
2. **Footer editable ONLY on index page**
3. **Save button enabled when Footer edited on index**
4. **Locale switch updates Footer content**
5. **Product pages don't lose Footer**
6. **Navigation preserves Footer**
7. **No hydration mismatches**
8. **No readonly errors**
9. **No false dirty states**
10. **Footer display is read-only on non-index pages**
