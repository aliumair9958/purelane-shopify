# Purelane — Shopify Homepage Build

Production Shopify sections built from a static HTML/CSS prototype
(`purelane-homepage.html`), on a stock Dawn install.

**Live theme:** see submission email for dev store URL + password.

## What's here

Five required sections, built as reusable, merchant-editable Liquid:

| Section | File |
|---|---|
| Hero | `sections/hero.liquid` |
| Shop / product grid | `sections/shop-grid.liquid` |
| Best-selling combos | `sections/combos.liquid` |
| Bundles | `sections/bundles.liquid` |
| Reviews rail | `sections/reviews.liquid` |

Shared code:
- `snippets/product-card.liquid` — reusable card, used by Shop grid (and informs Combos' card structure)
- `snippets/icon.liquid` — centralized inline SVG icons
- `snippets/scenes-background.liquid` + `assets/purelane-scenes.js` — the shared background gradient system all 5 sections sit on
- `assets/purelane-base.css` — all custom styling
- `assets/purelane-reveal.js`, `purelane-hero.js`, `purelane-combos.js` — section-specific interaction (scroll reveal, hero tier rotation, keyboard rail scrolling)

## Docs

- [`docs/BUILD_NOTES.md`](docs/BUILD_NOTES.md) — prototype critique, what changed and why, what's next
- [`docs/AI_WORKFLOW_NOTES.md`](docs/AI_WORKFLOW_NOTES.md) — AI workflow notes
- [`docs/METAOBJECT_DEFINITIONS.md`](docs/METAOBJECT_DEFINITIONS.md) — `Combo` and `Customer review` metaobject schemas

## Data model

- **Combos** and **Reviews** are backed by metaobjects (curated,
  repeatable entries a merchant adds many of).
- **Bundles** and **Hero's pricing tiers** are section blocks (a small,
  bounded set of variants configured once in the theme editor).

See `docs/METAOBJECT_DEFINITIONS.md` for exact field schemas.

## Local development

```bash
shopify theme dev --store=<your-store>.myshopify.com
```

---

This theme is built on [Dawn](https://github.com/Shopify/dawn),
Shopify's free reference theme (MIT licensed — see `LICENSE.md`).
