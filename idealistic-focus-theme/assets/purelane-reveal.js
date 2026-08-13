/**
 * purelane-reveal.js
 * Shared scroll-reveal for any .rv element on the page. Loaded once globally
 * (theme.liquid) rather than per-section, so sections can be reordered,
 * duplicated, or removed in the theme editor without re-registering observers
 * incorrectly or leaking listeners.
 *
 * Re-runs safely on Shopify section:load events (theme editor add/reorder)
 * via the shopify:section:load listener at the bottom.
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ro = null;

  function revealAll(root) {
    var revs = (root || document).querySelectorAll('.rv:not([data-rv-bound])');
    if (!revs.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      revs.forEach(function (el) {
        el.setAttribute('data-rv-bound', '');
        el.classList.add('in');
      });
      return;
    }

    document.documentElement.setAttribute('data-rv-ready', '');
    if (!ro) {
      ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            ro.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    }
    revs.forEach(function (el) {
      el.setAttribute('data-rv-bound', '');
      ro.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () { revealAll(document); });
  // Theme editor: newly injected section markup needs (re)binding.
  document.addEventListener('shopify:section:load', function (e) { revealAll(e.target); });
  // If reveal.js loads after DOMContentLoaded (deferred), still run once.
  if (document.readyState !== 'loading') revealAll(document);
})();
