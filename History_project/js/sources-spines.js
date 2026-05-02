(function () {
  var sourcesTouchUiMq = window.matchMedia("(hover: none), (pointer: coarse)");

  var TAGLINE_DOMESTIC =
    "Наведите на корешок — он подсветится; ниже появятся название и краткое описание. Сайт источника открывается нажатием на корешок.";
  var TAGLINE_DOMESTIC_TOUCH =
    "Нажмите на корешок — появятся название и описание. Двойное нажатие по тому же корешку откроет сайт источника.";
  var TAGLINE_FOREIGN =
    "Наведите на корешок — ниже появится название монографии и выходные данные. Прямой ссылки на полный текст нет.";

  var tabDomestic = document.getElementById("tab-domestic");
  var tabForeign = document.getElementById("tab-foreign");
  var paneDomestic = document.getElementById("domestic");
  var paneForeign = document.getElementById("foreign");
  var heading = document.getElementById("sources-heading");
  var tagline = document.getElementById("sources-tagline");

  function domesticTaglineText() {
    return sourcesTouchUiMq.matches ? TAGLINE_DOMESTIC_TOUCH : TAGLINE_DOMESTIC;
  }

  function initShelf(shelf) {
    var panel = shelf.querySelector(".sources-spine-panel");
    if (!panel) return;

    var content = panel.querySelector(".sources-spine-panel__content");
    if (!content) return;

    var isForeign = content.classList.contains("sources-spine-panel__content--foreign");
    var titleTextEl = content.querySelector(".sources-spine-panel__title-text");
    var metaEl = content.querySelector(".sources-spine-panel__meta");

    var spines = shelf.querySelectorAll(".sources-spine[data-spine-title]");
    var activeClass = "sources-spine--active";

    var lastTapSpine = null;
    var lastTapAt = 0;
    var DOUBLE_MS = 650;

    function setActiveSpine(spine) {
      spines.forEach(function (s) {
        s.classList.remove(activeClass);
      });
      spine.classList.add(activeClass);
    }

    function clearActiveSpines() {
      spines.forEach(function (s) {
        s.classList.remove(activeClass);
      });
    }

    function fillFromSpine(spine) {
      var title = spine.dataset.spineTitle || "";
      var meta = spine.dataset.spineMeta || "";
      content.hidden = false;

      if (isForeign && titleTextEl) {
        titleTextEl.textContent = title;
        if (metaEl) metaEl.textContent = meta;
        return;
      }

      if (!isForeign && titleTextEl && metaEl) {
        titleTextEl.textContent = title;
        metaEl.textContent = meta;
      }
    }

    function resetPanel() {
      content.hidden = true;
    }

    var panelFrame = 0;
    function fillFromSpineRaf(spine) {
      if (panelFrame) {
        cancelAnimationFrame(panelFrame);
      }
      panelFrame = requestAnimationFrame(function () {
        panelFrame = 0;
        fillFromSpine(spine);
      });
    }

    spines.forEach(function (spine) {
      spine.addEventListener("mouseenter", function () {
        setActiveSpine(spine);
        fillFromSpineRaf(spine);
      });
      spine.addEventListener("focus", function () {
        setActiveSpine(spine);
        fillFromSpineRaf(spine);
      });

      if (!isForeign && spine.tagName === "A" && spine.getAttribute("href")) {
        spine.addEventListener(
          "click",
          function (e) {
            if (!sourcesTouchUiMq.matches) return;
            e.preventDefault();
            var now = Date.now();
            if (lastTapSpine === spine && now - lastTapAt < DOUBLE_MS) {
              var target = spine.getAttribute("target") || "_blank";
              window.open(spine.href, target, "noopener,noreferrer");
              lastTapSpine = null;
              lastTapAt = 0;
              return;
            }
            lastTapSpine = spine;
            lastTapAt = now;
            setActiveSpine(spine);
            fillFromSpineRaf(spine);
          },
          true
        );
      }
    });

    shelf.addEventListener("mouseleave", function () {
      clearActiveSpines();
      resetPanel();
    });

    shelf.addEventListener("focusout", function () {
      requestAnimationFrame(function () {
        if (!shelf.contains(document.activeElement)) {
          clearActiveSpines();
          resetPanel();
        }
      });
    });
  }

  document.querySelectorAll(".sources-shelf").forEach(function (shelf) {
    initShelf(shelf);
  });

  if (tabDomestic && tabForeign && paneDomestic && paneForeign && heading && tagline) {
    function resetAllPanels() {
      document.querySelectorAll(".sources-spine-panel__content").forEach(function (el) {
        el.hidden = true;
      });
      document.querySelectorAll(".sources-spine--active").forEach(function (el) {
        el.classList.remove("sources-spine--active");
      });
    }

    function activateTab(kind) {
      var domestic = kind === "domestic";
      tabDomestic.setAttribute("aria-selected", domestic ? "true" : "false");
      tabForeign.setAttribute("aria-selected", domestic ? "false" : "true");
      paneDomestic.hidden = !domestic;
      paneForeign.hidden = domestic;
      heading.textContent = domestic ? "Отечественные источники" : "Зарубежная литература";
      tagline.textContent = domestic ? domesticTaglineText() : TAGLINE_FOREIGN;
      resetAllPanels();
    }

    tabDomestic.addEventListener("click", function () {
      activateTab("domestic");
    });
    tabForeign.addEventListener("click", function () {
      activateTab("foreign");
    });

    if (location.hash === "#foreign") {
      activateTab("foreign");
    } else {
      tagline.textContent = domesticTaglineText();
    }

    sourcesTouchUiMq.addEventListener("change", function () {
      if (tabDomestic.getAttribute("aria-selected") === "true") {
        tagline.textContent = domesticTaglineText();
      }
    });
  }
})();
