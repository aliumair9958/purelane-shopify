# Build Notes — Purelane Homepage

## What I'd flag about the original file

**No Shopify awareness, as expected of a design prototype.** Everything —
copy, prices, product names, review quotes, star counts — was hand-typed
into the HTML. None of it survives a merchant actually running the store:
prices go stale the day they change a price, reviews never update, and a
sold-out product still shows "Add to cart."

**Specific issues worth calling out:**

- **Scroll-reveal fails unsafely.** `.rv` elements were set to
  `opacity:0` in plain CSS, with JS responsible for revealing them. If JS
  fails to load — slow connection, ad blocker, script error — the content
  never appears. That's a real risk, not a style choice. Fixed by gating
  the hidden state behind `html[data-rv-ready]`, which JS only sets once
  it's confirmed it can actually do the reveal.
- **Reviews marquee has no keyboard access.** A `overflow-x: auto` /
  `scroll-snap` rail is reachable by mouse and touch, not by keyboard.
  Same gap existed in the Combos rail. Added `tabindex="0"` +
  `role="region"` + arrow-key scroll handling to both.
- **Hardcoded product art assumes transparent illustrations.** The hero's
  overlapping-bottle staging (`.hp`, height-driven with negative margins)
  was built for hand-drawn, transparent-background art. The moment real
  product photography (studio white background) goes in, the illusion
  breaks — bottles show a visible white box instead of floating freely.
  This isn't fixable in code; it needs transparent product PNGs, which
  I flagged and the client sourced mid-build. Worth documenting for the
  actual merchant onboarding: **product photography for the hero and
  combo staging needs transparent backgrounds**, or those sections should
  fall back to a card-frame treatment instead.
- **No handling for empty states.** No sold-out styling, no no-image
  fallback, no long-title truncation anywhere in the original CSS —
  reasonable for a prototype with cherry-picked demo content, not
  reasonable once real inventory hits it.

## What I changed in the code, and why

**Reusable `product-card` snippet.** Shop grid and Combos both render
near-identical product cards in the original file, just with different
copy. Built once as `snippets/product-card.liquid`, used by Shop grid
directly and informed the card structure Combos' metaobject-driven cards
follow. One place to fix a card bug instead of two.

**Combos → metaobject, not hardcoded blocks.** A combo is a curated set
of specific products at a fixed price with per-product marketing copy.
Nothing native models that — not a collection (no fixed price), not a
discount (no curated narrative copy). Modeled as a `combo` metaobject
so a merchant adds a 6th combo from Content → Metaobjects, no template
edit required.

**Bundles → section blocks, not a metaobject.** Unlike Combos, a bundle
tier ("pick any 2 products for ₹349") has no fixed product list — it's a
generic pricing plan. That maps cleanly to section blocks, same pattern
as Hero's rotating pricing tiers, and avoids the metaobject-admin overhead
for something a merchant is more likely to just edit inline in the
theme editor.

**Reviews → metaobject, same reasoning as Combos.** A review is authored
content (title, body, star count, customer name, optional product tag),
not something the store necessarily has a review app plumbed into. The
metaobject gives a merchant a clean form to add/retire reviews from.

**Shared "scenes" background layer.** The original's moody background
is one shared, fixed-position gradient system that four sections sit on
top of, with a scroll listener fading between zones. I initially built
Hero with its own standalone gradient — wrong call, it visually
disconnected Hero from everything after it. Rebuilt as a shared
`snippets/scenes-background.liquid` + `purelane-scenes.js`, included
once in `theme.liquid`, that all 5 sections key into via a `data-scene`
attribute. The full canvas/water-shimmer animation layer from the
original is *not* reproduced — that's a decorative embellishment on top
of the gradient system, genuinely bonus scope, and I prioritized getting
the 5 required sections solid over that.

**Money filter unit fix.** Shopify's `money` filter expects amounts in
the smallest currency unit (paise), not whole rupees. Section settings
using plain "number" fields (Hero's tier prices, Bundles' tier prices)
needed `| times: 100` before `| money`, or ₹499 rendered as ₹4.99. Real
product prices from `product.price` don't need this — those come from
Shopify already in the correct unit.

**Sold out / no image / long title, all handled explicitly** in
`product-card.liquid`: disabled "Sold out" button state, a placeholder
icon in place of a broken `<img>`, and `-webkit-line-clamp: 2` so a long
title clips instead of breaking card height alignment.

## What I'd do with more time

- Reproduce the animated water/canvas shimmer layer properly instead of
  the static gradient fallback — closer to full visual parity, though it's
  the single most expensive remaining piece relative to its impact.
- Real Lighthouse pass and image `srcset` tuning per breakpoint rather
  than the current best-guess `widths` values.
- Wire an actual review app's metafield schema (Judge.me/Loox) instead of
  the standalone `customer_review` metaobject, so ratings sync
  automatically instead of being manually authored.
- Tighten the nav/header and footer to match the prototype's chrome —
  currently still stock Dawn, out of scope per the brief's "these 5
  sections first" but worth finishing for a real launch.
- A cleaner git history. Later commits ended up larger than I'd like due
  to heavy live theme-editor iteration; I'd script or discipline smaller,
  more frequent commits earlier next time rather than batching after
  verifying in the editor.
