(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".site-header__menu-toggle");
  var nav = document.getElementById("site-nav-primary");
  if (!header || !toggle || !nav) return;

  var mq = window.matchMedia("(max-width: 640px)");

  function setOpen(open) {
    header.classList.toggle("is-nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.documentElement.classList.toggle("site-nav-is-open", open);
  }

  function close() {
    setOpen(false);
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!mq.matches) return;
    setOpen(!header.classList.contains("is-nav-open"));
  });

  nav.querySelectorAll("a.site-nav__pill").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mq.matches) close();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  document.addEventListener(
    "click",
    function (e) {
      if (!mq.matches || !header.classList.contains("is-nav-open")) return;
      if (toggle.contains(e.target) || nav.contains(e.target)) return;
      close();
    },
    true
  );

  mq.addEventListener("change", function () {
    if (!mq.matches) close();
  });
})();
