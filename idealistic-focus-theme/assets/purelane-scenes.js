/**
 * purelane-scenes.js
 * Watches every element with a [data-scene] attribute (each of our 5
 * sections carries one, matching the prototype's zoning: Hero=1, mid
 * sections=2/3, footer=4) and cross-fades the matching .scene gradient
 * layer in scenes-background.liquid as the visitor scrolls.
 *
 * Uses IntersectionObserver with a thin horizontal trigger band near the
 * top of the viewport, rather than a scroll+rAF loop, so it stays cheap —
 * relevant given the brief's Core Web Vitals requirement.
 */
(function () {
  var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
  var layers = [].slice.call(document.querySelectorAll('[data-scene-layer]'));
  if (!zones.length || !layers.length) return;

  function setScene(n) {
    layers.forEach(function (layer) {
      layer.classList.toggle('on', layer.getAttribute('data-scene-layer') === String(n));
    });
  }

  if (!('IntersectionObserver' in window)) return; // static first scene is a fine fallback

  var current = zones[0].getAttribute('data-scene') || '1';
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var n = entry.target.getAttribute('data-scene');
          if (n && n !== current) {
            current = n;
            setScene(n);
          }
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );

  zones.forEach(function (zone) { observer.observe(zone); });
})();
