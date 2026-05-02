(function () {
  if (!document.body || !document.body.classList.contains("page-doc")) return;

  const root = document.documentElement;
  let hideTimer = null;
  const HIDE_MS = 900;

  function showScrollbarTransient() {
    root.classList.add("is-scroll-interacting");
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      root.classList.remove("is-scroll-interacting");
      hideTimer = null;
    }, HIDE_MS);
  }

  window.addEventListener("scroll", showScrollbarTransient, { passive: true });
  window.addEventListener("wheel", showScrollbarTransient, { passive: true });
})();
