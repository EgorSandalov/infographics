(function () {
  const wrap = document.querySelector(".scroll-wrap");
  const nav = document.querySelector(".chapter-nav");
  if (!wrap || !nav) return;

  const chapters = wrap.querySelectorAll(".chapter");
  const pits = nav.querySelectorAll(".chapter-nav__pit");
  if (!chapters.length || !pits.length) return;

  let activeIndex = 0;
  let wheelLock = false;
  const WHEEL_COOLDOWN_MS = 520;

  function clamp(i) {
    return Math.max(0, Math.min(chapters.length - 1, i));
  }

  function setActiveIndex(i) {
    activeIndex = clamp(i);
    nav.style.setProperty("--chapter-nav-index", String(activeIndex));
    pits.forEach(function (p, j) {
      p.setAttribute("aria-current", j === activeIndex ? "true" : "false");
    });
  }

  function scrollToIndex(i) {
    const idx = clamp(i);
    setActiveIndex(idx);
    chapters[idx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function indexFromScroll() {
    const w = wrap.clientWidth || 1;
    return clamp(Math.round(wrap.scrollLeft / w));
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const i = Array.prototype.indexOf.call(chapters, entry.target);
        if (i < 0) return;
        setActiveIndex(i);
      });
    },
    { root: wrap, threshold: 0.55 }
  );

  chapters.forEach(function (ch) {
    io.observe(ch);
  });

  pits.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      scrollToIndex(i);
    });
  });

  wrap.addEventListener(
    "wheel",
    function (e) {
      const dy = e.deltaY;
      const dx = e.deltaX;
      const dominantX = Math.abs(dx) > Math.abs(dy);

      if (dominantX && Math.abs(dx) > 0) {
        e.preventDefault();
        wrap.scrollLeft += dx;
        return;
      }

      if (Math.abs(dy) < 1) return;

      e.preventDefault();

      if (wheelLock) return;

      const dir = dy > 0 ? 1 : -1;
      const cur = indexFromScroll();
      const next = clamp(cur + dir);
      if (next === cur) return;

      wheelLock = true;
      scrollToIndex(next);

      window.setTimeout(function () {
        wheelLock = false;
      }, WHEEL_COOLDOWN_MS);
    },
    { passive: false }
  );

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;

      const k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(indexFromScroll() + 1);
        return;
      }
      if (k === "ArrowLeft" || k === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(indexFromScroll() - 1);
        return;
      }
      if (k === "Home") {
        e.preventDefault();
        scrollToIndex(0);
        return;
      }
      if (k === "End") {
        e.preventDefault();
        scrollToIndex(chapters.length - 1);
      }
    },
    true
  );

  let scrollBarHideTimer = null;
  const SCROLLBAR_HIDE_MS = 900;

  function showScrollbarTransient() {
    wrap.classList.add("is-scroll-interacting");
    if (scrollBarHideTimer) window.clearTimeout(scrollBarHideTimer);
    scrollBarHideTimer = window.setTimeout(function () {
      wrap.classList.remove("is-scroll-interacting");
      scrollBarHideTimer = null;
    }, SCROLLBAR_HIDE_MS);
  }

  wrap.addEventListener("scroll", function () {
    showScrollbarTransient();
    if (wheelLock) return;
    const i = indexFromScroll();
    if (i !== activeIndex) setActiveIndex(i);
  });

  wrap.addEventListener("wheel", showScrollbarTransient, { passive: true });

  setActiveIndex(0);
})();
