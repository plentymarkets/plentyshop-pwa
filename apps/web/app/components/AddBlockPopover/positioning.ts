/** @description Minimum gap between the panel and each viewport edge. */
export const VIEWPORT_EDGE_MARGIN = 8;

/** @description Vertical gap between the anchor element and the panel. */
export const ANCHOR_GAP = 12;

/** @description Minimum horizontal distance of the arrow from the panel's corners, matching the panel's border-radius. */
export const ARROW_EDGE_PADDING = 12;

/** @description Offset that positions the arrow so it visually straddles the panel edge (approximately half the arrow element size). */
export const ARROW_INSET = 7;

/** @description Clamps the panel horizontally so it stays within the viewport with VIEWPORT_EDGE_MARGIN clearance on both sides. */
export const clampHorizontal = (anchorCenterX: number, panelWidth: number): number =>
  Math.max(
    VIEWPORT_EDGE_MARGIN,
    Math.min(anchorCenterX - panelWidth / 2, window.innerWidth - panelWidth - VIEWPORT_EDGE_MARGIN),
  );

/** @description Returns the panel top when placed below the anchor. */
export const placeBelow = (anchorBottom: number): number => anchorBottom + ANCHOR_GAP;

/** @description Returns the panel top when placed above the anchor. */
export const placeAbove = (anchorTop: number, panelHeight: number): number => anchorTop - panelHeight - ANCHOR_GAP;

/** @description Returns true when the panel fits below the anchor without clipping the viewport. */
export const fitsBelow = (top: number, panelHeight: number): boolean =>
  top + panelHeight + VIEWPORT_EDGE_MARGIN <= window.innerHeight;

/** @description Returns true when the panel fits above the anchor without clipping the viewport. */
export const fitsAbove = (top: number): boolean => top >= VIEWPORT_EDGE_MARGIN;

/** @description Clamps the arrow horizontally so it stays within the panel bounds, clear of the rounded corners. */
export const clampArrowHorizontal = (panelLeft: number, anchorCenterX: number, panelWidth: number): number =>
  Math.max(panelLeft + ARROW_EDGE_PADDING, Math.min(anchorCenterX, panelLeft + panelWidth - ARROW_EDGE_PADDING));

/** @description Returns the arrow's top position so it visually straddles the panel edge it points toward. */
export const arrowVerticalPosition = (direction: 'up' | 'down', panelTop: number, panelHeight: number): number =>
  direction === 'down' ? panelTop + panelHeight - ARROW_INSET : panelTop - ARROW_INSET;
