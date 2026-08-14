# Metaobject & Metafield Definitions

Two custom metaobject types were created (Settings → Custom data →
Metaobjects) to model content the sections need that has no native
Shopify equivalent. Both are entirely merchant-editable from the admin —
no template edits required to add, edit, or retire an entry.

---

## Metaobject: `Combo` (type handle: `combo`)

Used by `sections/combos.liquid`. A combo is a curated set of specific
products bundled at a fixed price with per-product marketing copy —
not a collection (no fixed price) and not a discount (no curated
narrative copy), so neither native object fits.

| Field | Handle | Type | List? | Notes |
|---|---|---|---|---|
| Title | `title` | Single line text | No | e.g. "Kitchen essentials" |
| Tagline products | `tagline_products` | Product reference | **Yes** | Products shown in the combo's icon stack, in display order |
| Tagline text | `tagline_text` | Single line text | **Yes** | Per-product micro-copy (e.g. "Cuts grease instantly"), same order/length as `tagline_products` |
| Price | `price` | Money | No | The bundled price |
| Compare-at price | `compare_at_price` | Money | No | Used to compute the "You save ₹X" badge |
| Flag label | `flag_label` | Single line text | No | Optional — e.g. "Most popular" |
| Featured | `featured` | True or false | No | `true` gets the accent-bordered "hero" card treatment |
| Description | `description` | Multi-line text | No | The "Includes: ..." paragraph |

Section wiring: `sections/combos.liquid` has a `combo` block type whose
only setting is a `metaobject` picker scoped to `combo`. Add a combo
block, pick an entry, done.

---

## Metaobject: `Customer review` (type handle: `customer_review`)

Used by `sections/reviews.liquid`. Authored review content — not
necessarily backed by a review app, so modeled directly rather than
assuming a specific app's metafield schema.

| Field | Handle | Type | List? | Notes |
|---|---|---|---|---|
| Rating | `rating` | Integer | No | 1–5 |
| Title | `title` | Single line text | No | Short headline, e.g. "Works like a charm" |
| Body | `body` | Multi-line text | No | The review quote |
| Author name | `author_name` | Single line text | No | |
| Product reference | `product_ref` | Product reference | No | Optional — powers the "· Product name" tag |

Section wiring: `sections/reviews.liquid` has a `review` block type with
a `metaobject` picker scoped to `customer_review`. The block set renders
twice in the marquee track (required for the seamless infinite-scroll
CSS animation) — that's a template-level duplication, not duplicate
data entry.

---

## Product metafields referenced (not created by this build)

`snippets/product-card.liquid` reads two optional metafields for the
star-rating line on Shop grid cards, matching the namespace most review
apps (Judge.me, Loox) write to by default:

- `reviews.rating` (decimal) — average rating
- `reviews.rating_count` (number) — review count

These are **read defensively**: if a product has neither set, the
rating line is omitted rather than showing a broken or fabricated
value. No review app is installed on this dev store, so these are
currently unset on all seeded products — expected, not a bug. Once a
real review app is installed, existing product cards will start showing
ratings automatically with no template change needed.
