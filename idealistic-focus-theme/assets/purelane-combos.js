/**
 * purelane-combos.js
 * The combo rail is a native horizontally-scrolling container (matches the
 * prototype's behaviour: touch swipe and shift+wheel just work natively).
 * The one real gap is keyboard access — a plain overflow:auto region isn't
 * reachable by keyboard by default. This adds arrow-key scrolling once the
 * rail is focused (tabindex="0" + role="region" in combos.liquid).
 */
(function () {
  function bind(rail) {
    if (rail.dataset.comboBound) return;
    rail.dataset.comboBound = 'true';
    rail.addEventListener('keydown', function (e) {
      var card = rail.querySelector('.combo');
      var step = card ? card.getBoundingClientRect().width + 14 : 300;
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: step, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -step, behavior: 'smooth' }); e.preventDefault(); }
    });
  }

  function init(root) {
    (root || document).querySelectorAll('[data-combo-rail]').forEach(bind);
  }

  document.addEventListener('DOMContentLoaded', function () { init(document); });
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
  if (document.readyState !== 'loading') init(document);
})();
