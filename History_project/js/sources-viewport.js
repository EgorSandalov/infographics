(function () {
  var root = document.documentElement;

  function syncSourcesViewport() {
    var vv = window.visualViewport;
    var h = vv ? vv.height : window.innerHeight;
    var w = vv ? vv.width : window.innerWidth;
    root.style.setProperty("--sources-viewport-h", h + "px");
    root.style.setProperty("--sources-viewport-w", w + "px");
  }

  syncSourcesViewport();

  window.addEventListener("resize", syncSourcesViewport, { passive: true });
  window.addEventListener("orientationchange", syncSourcesViewport, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncSourcesViewport, { passive: true });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") syncSourcesViewport();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncSourcesViewport);
  }
  window.addEventListener("load", syncSourcesViewport);

  requestAnimationFrame(function () {
    requestAnimationFrame(syncSourcesViewport);
  });
  setTimeout(syncSourcesViewport, 0);
  setTimeout(syncSourcesViewport, 100);
})();
