# Frontend Roadmap

## Reference breakdown

The provided reference image breaks down into five frontend layers:

1. branded floating header with active navigation and CTA
2. split hero with left-aligned narrative copy and a right-aligned holographic medical stage
3. floating benefits ribbon with five equal-value platform cards
4. large technology panel with a nano-robot visual, product description, and four capability pillars
5. lower supporting sections for roadmap, about, and recruiting/contact anchors

## Current implementation

Implemented now:

- custom Robeaute-style homepage header
- light blue glass visual system with yellow accent
- holographic hero stage built from HTML/CSS rather than external heavy media
- pointer-reactive parallax on hero layers
- section-aware nav highlighting on scroll
- benefit ribbon
- nano-robot technology panel
- supporting roadmap and about/careers blocks

## Remaining todo

### Phase 2: visual fidelity

- replace abstract clinician silhouette with approved branded illustration or render
- replace abstract brain visualization with higher-fidelity domain visual
- replace placeholder charts with product-specific data visuals
- add a final approved Robeaute logo asset

### Phase 3: responsive polish

- tighten tablet layout for dense HUD cards
- simplify hero stage content on small mobile viewports
- validate spacing and legibility across common investor laptop sizes

### Phase 4: content architecture

- insert final investor headline hierarchy
- write real section copy for technology, solutions, impact, about, and careers
- add clinical workflow framing and proof points

### Phase 5: motion and production hardening

- choreograph entrance timing and hover states
- optimize large shadows/blur usage for performance
- test Lighthouse, accessibility contrast, and reduced-motion behavior
