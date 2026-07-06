# Z-Index Visual Hierarchy Tree

## Legend
```
📦 = Creates NEW stacking context (traps children)
🔓 = No stacking context (children can escape)
✅ = Works correctly
❌ = Broken (can't reach intended z-level)
⚠️  = Inconsistent behavior
```

---

## Current State (BROKEN) 💥

```
<body> (z-index: auto, root stacking context)
│
├─ 📦 UtilityBar <header> (z-index: 1 = z-raised)
│  │  ↳ Creates stacking context at level 1
│  │
│  ├─ ❌ NavbarBottom (z-index: 40 = z-sticky, position: fixed)
│  │     ↳ TRAPPED! Can only reach z-index 40 WITHIN parent's context
│  │     ↳ Effective z-index in document: ~1.40 (behind blocks at root level 0!)
│  │
│  └─ Navigation menu items (z-index: auto)
│
├─ 📦 MegaMenu <header> (z-index: 40 = z-sticky)
│  │  ↳ Creates stacking context at level 40
│  │
│  ├─ ❌ Desktop Dropdown (z-index: 40 = z-sticky)
│  │     ↳ TRAPPED! Stuck at parent's level
│  │     ↳ Appears below EditableBlocks because parent context = 40
│  │
│  └─ ❌ Mobile Drawer (z-index: 80 = z-drawer)
│        ↳ TRAPPED! Can't escape parent
│
├─ 🔓 EditableBlocks <div> (z-index: auto)
│  │  ↳ No stacking context (good!)
│  │
│  └─ 📦 PageBlock (z-index: 0 = z-base)
│     │  ↳ Creates stacking context at level 0
│     │  ↳ But since parent is auto, this still stacks at root
│     │
│     ├─ Block Content (z-index: auto)
│     │
│     └─ 📦 PageBlock > UtilityBar nested (inherits from outer UtilityBar)
│        │  ↳ Stacking context from outer UtilityBar propagates
│        │
│        └─ ❌ NavbarBottom again (still trapped!)
│
└─ Cookiebar (z-index: 90, position: fixed)
   ↳ ✅ At root level, works correctly
```

### The Problem Visualized

```
Document Stacking Order (what browser sees):

  200  🔓 <body>
       │
   90  ├─ Cookiebar (✅ works)
       │
   40  ├─ 📦 MegaMenu header (creates context)
       │  ├─ Dropdown thinks it's at 40
       │  └─ Drawer thinks it's at 80
       │     ↳ But BOTH trapped inside parent's level 40!
       │
    1  ├─ 📦 UtilityBar header (creates context)  
       │  └─ NavbarBottom thinks it's at 40
       │     ↳ But TRAPPED inside parent's level 1!
       │
    0  └─ 📦 EditableBlocks > PageBlock (z-base = 0)
          └─ Content appears ABOVE navbars! 🤯
```

**Why NavbarBottom appears BEHIND blocks:**
1. UtilityBar header has `z-index: 1` → Creates stacking context
2. NavbarBottom has `z-index: 40` but is INSIDE that context
3. NavbarBottom is stuck at parent level 1 (not 40!)
4. EditableBlocks at root level 0 actually renders above it

---

## After Phase 1: Remove Sticky z-index (BETTER) ✨

```
<body> (z-index: auto, root stacking context)
│
├─ 🔓 UtilityBar <header> (z-index: auto = removed z-raised)
│  │  ↳ No stacking context! Children free!
│  │
│  └─ Navigation menu items (z-index: auto)
│
├─ 🔓 MegaMenu <header> (z-index: auto = removed z-sticky)
│  │  ↳ No stacking context! Children free!
│  │
│  ├─ ⚠️  Desktop Dropdown (z-index: 40 = z-sticky)
│  │     ↳ Now reaches root level 40, but still in DOM tree
│  │     ↳ Better but not ideal
│  │
│  └─ ⚠️  Mobile Drawer (z-index: 80 = z-drawer)
│        ↳ Now reaches root level 80
│        ↳ Better but not ideal
│
├─ 🔓 EditableBlocks <div> (z-index: auto = removed z-base)
│  │  ↳ No stacking context
│  │
│  └─ Block Content (z-index: auto)
│     ↳ Stacks naturally, no explicit z-index needed
│
└─ ⚠️  NavbarBottom (z-index: 40, position: fixed)
   ↳ Still nested in DOM but can now reach root z-index 40
   ↳ Works, but fragile if parent gets z-index later
```

### Stacking Order After Phase 1

```
Document Stacking Order:

  90  ├─ Cookiebar ✅
   80  ├─ MegaMenu Mobile Drawer ✅
   40  ├─ MegaMenu Desktop Dropdown ✅
   40  ├─ NavbarBottom ✅
    0  └─ EditableBlocks content ✅
```

**Better! But still fragile** - if anyone adds z-index to headers later, we break again.

---

## After Phase 2: Teleport Everything (PERFECT) 🎯

```
<body> (z-index: auto, root stacking context)
│
├─ 🔓 UtilityBar <header> (z-index: auto)
│  │  ↳ Just a sticky header, no overlays
│  │
│  └─ Navigation menu items (z-index: auto)
│
├─ 🔓 MegaMenu <header> (z-index: auto)
│  │  ↳ Just a sticky header, no overlays
│  │
│  └─ Navigation menu items (z-index: auto)
│
├─ 🔓 EditableBlocks <div> (z-index: auto)
│  │
│  └─ Block Content (z-index: auto)
│     ↳ No explicit z-index, stacks naturally
│
└─ <Teleport to="body"> (All overlays at root level!)
   │
   ├─ ✅ NavbarBottom (z-index: 50 = z-overlay, fixed)
   │
   ├─ ✅ MegaMenu Desktop Dropdown (z-index: 50 = z-overlay, fixed)
   │
   ├─ ✅ MegaMenu Mobile Drawer (z-index: 110 = z-drawer, fixed)
   │  └─ Drawer Backdrop (z-index: 100 = z-backdrop)
   │
   ├─ ✅ Cookiebar (z-index: 50 = z-overlay, fixed)
   │
   ├─ ✅ Modal (z-index: 120 = z-modal)
   │  └─ Modal Backdrop (z-index: 100 = z-backdrop)
   │
   ├─ ✅ Editor Toolbar (z-index: 150 = z-editor)
   │
   └─ ✅ Loaders (z-index: 200 = z-critical)
```

### Final Stacking Order (5 Clean Levels)

```
Document Stacking Order:

 200  ├─ z-critical (Loaders, critical alerts)
      │
 150  ├─ z-editor (Editor tools & panels)
      │
 120  ├─ z-modal (Modal dialogs)
 110  ├─ z-drawer (Side drawers)  
 100  ├─ z-backdrop (Modal/drawer backdrops)
      │
  50  ├─ z-overlay (NavbarBottom, MegaMenu, Dropdowns, Tooltips, Cookiebar)
      │
   0  └─ z-content / auto (All page content, blocks, headers)
```

**Perfect!** Everything is predictable and at the right level.

---

## Detailed Component Examples

### Example 1: NavbarBottom (The Original Problem)

#### BEFORE (Broken) ❌
```
UtilityBar (z-index: 1, creates stacking context)
│
└─ NavbarBottom (z-index: 40, position: fixed)
   ↳ Thinks it's at 40, but actually at parent's level 1
   ↳ EditableBlocks at root 0 appear ABOVE it
```

**DOM Tree:**
```html
<header class="z-raised">  <!-- z-index: 1 = TRAP -->
  <!-- ... -->
  <nav class="z-sticky fixed">  <!-- z-index: 40 but TRAPPED -->
    NavbarBottom
  </nav>
</header>

<div>  <!-- EditableBlocks -->
  <div class="z-base">  <!-- z-index: 0 at ROOT -->
    Blocks appear ABOVE navbar! 🤯
  </div>
</div>
```

#### AFTER (Perfect) ✅
```
UtilityBar (z-index: auto, no stacking context)
│
└─ (NavbarBottom removed from here)

<Teleport to="body">
  └─ NavbarBottom (z-index: 50, position: fixed)
     ↳ At root level, always above content
</Teleport>
```

**DOM Tree:**
```html
<header>  <!-- NO z-index -->
  <!-- ... -->
  <!-- NavbarBottom no longer here -->
</header>

<div>  <!-- EditableBlocks -->
  <div>  <!-- NO z-index -->
    Blocks at natural level 0
  </div>
</div>

<!-- At document root -->
<nav class="z-overlay fixed">  <!-- z-index: 50 -->
  NavbarBottom (via Teleport)
</nav>
```

---

### Example 2: MegaMenu Dropdown (Also Broken)

#### BEFORE (Broken) ❌
```
MegaMenu <header> (z-index: 40, creates stacking context)
│
├─ Menu button (z-index: auto)
│
└─ Desktop Dropdown (z-index: 40)
   ↳ TRAPPED at parent's level 40
   ↳ Can't go above blocks if they're in different context
```

**Visual:**
```
  40  MegaMenu header 📦
      ├─ Dropdown @40 (trapped)
      │
   0  EditableBlocks (root level)
      └─ Blocks sometimes appear above dropdown!
```

#### AFTER (Perfect) ✅
```
MegaMenu <header> (z-index: auto, no stacking context)
│
├─ Menu button (z-index: auto)
│
└─ (Dropdown removed from here)

<Teleport to="body">
  └─ Desktop Dropdown (z-index: 50 = z-overlay)
     ↳ At root level, always above content
</Teleport>
```

**Visual:**
```
  50  Dropdown (teleported, at root) ✅
      │
   0  MegaMenu header (no z-index)
      │
   0  EditableBlocks
      └─ Blocks below overlay ✅
```

---

### Example 3: Modal Stack (Complex)

#### Current Nested Structure ⚠️
```
PageBlock (z-index: 0)
│
└─ Button → Opens Modal (z-index: 210)
   │
   ├─ Modal Backdrop (z-index: 200)
   │  ↳ Behind modal
   │
   └─ Modal Content (z-index: 210)
      ↳ Above backdrop

Problem: If modal is nested in a stacking context, it's trapped!
```

#### After Teleport ✅
```
EditableBlocks (z-index: auto)
│
└─ Button (z-index: auto)
   ↳ Triggers modal open

<Teleport to="body"> (All at root)
│
├─ Modal Backdrop (z-index: 100 = z-backdrop)
│
├─ Modal Content (z-index: 120 = z-modal)
│
└─ Editor Toolbar (z-index: 150 = z-editor)
   ↳ Can still access above modal if needed
```

**Stacking:**
```
 150  Editor (always accessible) ✅
 120  Modal ✅
 100  Modal Backdrop ✅
   0  Page content (blocked by backdrop) ✅
```

---

## Key Insights

### Creating Stacking Context
An element creates a stacking context when:
1. `position: relative/absolute/fixed` + `z-index: <number>` (not auto)
2. `position: sticky` + `z-index: <number>`
3. Other properties (transform, opacity, etc.)

### The Trap
```
📦 Parent (z-index: 1)
   └─ Child (z-index: 9999)
      ↳ Child CANNOT escape parent's level 1!
      ↳ Child's 9999 is relative to parent, not document
```

### The Solution
```
🔓 Parent (z-index: auto)
   └─ (Child moved to <body> via Teleport)

<body>
   └─ Child (z-index: 9999)
      ↳ Child is at ROOT level 9999 ✅
```

---

## Testing Visualization

After refactoring, this should be the stack when everything is open:

```
┌─────────────────────────────────────────┐
│ 200: Loading Spinner (z-critical)      │ ← Always on top
├─────────────────────────────────────────┤
│ 150: Editor Toolbar (z-editor)         │ ← Can access while modal open
├─────────────────────────────────────────┤
│ 120: Modal Dialog (z-modal)            │
│  100: Modal Backdrop (z-backdrop)      │ ← Dims background
├─────────────────────────────────────────┤
│ 110: Mobile Drawer (z-drawer)          │ ← When no modal
│  100: Drawer Backdrop (z-backdrop)     │
├─────────────────────────────────────────┤
│  50: NavbarBottom (z-overlay)          │ ← Above content
│  50: MegaMenu Dropdown (z-overlay)     │
│  50: Tooltips (z-overlay)              │
│  50: Cookiebar (z-overlay)             │
├─────────────────────────────────────────┤
│   0: UtilityBar Header (sticky)        │
│   0: MegaMenu Header (sticky)          │ ← Natural stacking
│   0: Page Content / Blocks             │
└─────────────────────────────────────────┘
```

All clean, predictable levels! 🎉
