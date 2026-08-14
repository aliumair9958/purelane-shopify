# AI Workflow Notes — Purelane Build

## What I delegated

- **First-pass Liquid for all 5 sections and shared snippets**, working
  from the prototype's raw HTML/CSS — schema settings/blocks, the
  `product-card` snippet, and the metaobject vs. section-block data-model
  calls for Combos/Bundles/Reviews.
- **Debugging from screenshots and terminal output** — I described what I
  saw ("only one product should show," "it looks the same," "background
  isn't consistent") and pasted errors directly; the AI diagnosed root
  cause before proposing a fix rather than pattern-matching the visible
  symptom.
- **Git recovery** — diagnosing the nested-repo/submodule bug, and later
  the repo-structure sanity check, were both AI-led investigations against
  actual `git log`/`git status` output, not guesses.
- **Step-by-step environment setup** — Partner account through CLI
  through dev store, written for someone doing Shopify theme dev for the
  first time.

## Where it failed me / needed correction

- **First hero build ignored the prototype's actual layout logic.** I
  built a generic equal-width flex row for the multi-product hero stage;
  the original uses height-driven, negatively-margined, overlapping
  bottles with an `order` property controlling z-stacking. I caught this
  myself by eyeballing the reference screenshots side by side — the AI
  hadn't re-checked the source CSS closely enough the first time. Lesson:
  for pixel-accuracy work, make it re-derive sizing/positioning rules
  from the actual source file before building, not from a plausible
  general-purpose pattern.
- **CSS cascade fights happened twice** (body background losing to
  Dawn's own rule, then again with the promise-badges rail going white).
  Both got patched with `!important` as an unblock-now move rather than
  a proper fix — flagged honestly in both cases, but it's real debt: a
  production PR shouldn't ship `!important` as the actual solution, and
  I'd want to go back and load our stylesheet in the right cascade
  position instead.
- **Money filter unit bug** — didn't anticipate that Shopify's `money`
  filter expects paise, not rupees, for hand-typed schema price settings.
  Caught only because the storefront visibly showed ₹4.99 instead of
  ₹499. Should have been caught at build time, not by visual QA.
- **File-transfer friction repeatedly broke the workflow** — several
  rounds where generated files wouldn't download in-browser and had to
  be manually re-typed via find/replace in VS Code instead. Not an AI
  reasoning failure, but it cost real time and needs a better answer for
  a repeatable process (see below).
- **Local ⇄ remote state got out of sync twice** — once from a stuck
  terminal masking a stale error, once from theme-editor block/product
  selections getting silently overwritten by a later local file push,
  because `shopify theme dev` is a one-directional push from local files
  unless you explicitly `theme pull` first. This is a Shopify CLI
  behavior I should have flagged *before* the first editor session, not
  after losing work once.

## What I'd systematize for 20 more of these

- **A fixed local ⇄ remote sync ritual**: pull before editing locally any
  time the theme editor was touched, every session, not just after
  getting burned once. Worth just always running `theme pull
  --only=templates/index.json` at the start of a work session as habit.
- **A single canonical CSS variable naming and cascade-order pass up
  front** (load order, specificity plan) instead of patching `!important`
  reactively per section — would have avoided both cascade fights.
- **Extract a real component checklist before building any section**:
  pixel-check against the source file's actual CSS rules for
  sizing/positioning logic (not just colors/spacing), sold-out state,
  no-image state, long-content state, keyboard access, reduced-motion —
  as a fixed pass applied to every section, not discovered late per
  section like the marquee's keyboard-access gap was.
- **A faster, more reliable file hand-off path** than the download-card
  flow that repeatedly failed — e.g., working directly against the
  cloned repo via a connected tool, rather than round-tripping every
  file through manual download/save.
- **Decide metaobject vs. section-block up front per content type**,
  using a fixed rule (does this need a curated, specific, repeatable
  entity a merchant creates many of → metaobject; is it a small, bounded
  set of variants a merchant configures once → section block) rather than
  re-litigating the call per section.
