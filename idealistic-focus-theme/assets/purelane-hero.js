/**
 * purelane-hero.js
 * Drives the hero's rotating pricing-tier stage. Scoped to run once per
 * Hero section instance (theme editor can have zero, one, or duplicate
 * instances of this section — querying by [data-hero-stage] inside each
 * `.hero` keeps multiple instances from fighting over the same timer).
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initStage(stage) {
    var slides = [].slice.call(stage.querySelectorAll('.hslide'));
    var hero = stage.closest('.hero');
    var dots = hero ? [].slice.call(hero.querySelectorAll('.hdots button')) : [];
    if (slides.length < 2) return; // nothing to rotate

    var i = 0;
    var timer = null;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('on', idx === i); });
      dots.forEach(function (d, idx) {
        d.classList.toggle('on', idx === i);
        d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
    }

    function play() { if (!timer && !reduce) timer = setInterval(function () { show(i + 1); }, 3800); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { stop(); show(idx); play(); });
    });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', play);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : stop(); });
      }, { threshold: 0.2 }).observe(stage);
    } else if (!reduce) {
      play();
    }
  }

  function init(root) {
    (root || document).querySelectorAll('[data-hero-stage]').forEach(initStage);
  }

  document.addEventListener('DOMContentLoaded', function () { init(document); });
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
  if (document.readyState !== 'loading') init(document);
})();
