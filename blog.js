/* Güncan Estetik Blog — Filtering, Search, Nav */
(function () {
  "use strict";

  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".article-card[data-category]");
  const searchInput = document.getElementById("blog-search");
  const searchMeta = document.getElementById("search-meta");
  const emptyState = document.getElementById("empty-state");
  const menuToggle = document.getElementById("menu-toggle");
  const navlinks = document.getElementById("navlinks");

  let activeCategory = "tumu";
  let query = "";

  function normalize(str) {
    return (str || "")
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function matchesCategory(card) {
    if (activeCategory === "tumu") return true;
    const cats = (card.getAttribute("data-category") || "").split(/\s+/).filter(Boolean);
    return cats.includes(activeCategory);
  }

  function matchesSearch(card) {
    if (!query) return true;
    const hay = normalize([
      card.getAttribute("data-title") || "",
      card.getAttribute("data-excerpt") || "",
      card.getAttribute("data-category") || "",
      card.textContent || ""
    ].join(" "));
    return hay.indexOf(query) !== -1;
  }

  function labelFor(slug) {
    const map = {
      tumu: "Tümü", lipoliz: "Lipoliz", jinekomasti: "Jinekomasti",
      mezoterapi: "Mezoterapi", prp: "PRP", genclik: "Gençlik Aşısı",
      erkek: "Erkek Estetiği", sss: "SSS"
    };
    return map[slug] || slug;
  }

  function applyFilters() {
    let visible = 0;
    cards.forEach(function (card) {
      const show = matchesCategory(card) && matchesSearch(card);
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.classList.toggle("visible", visible === 0);
    if (searchMeta) {
      if (query || activeCategory !== "tumu") {
        searchMeta.textContent =
          visible + " yazı gösteriliyor" +
          (activeCategory !== "tumu" ? " · " + labelFor(activeCategory) : "") +
          (query ? ' · "' + searchInput.value.trim() + '"' : "");
      } else {
        searchMeta.textContent = cards.length + " bilgilendirici yazı";
      }
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      activeCategory = chip.getAttribute("data-filter") || "tumu";
      applyFilters();
      const grid = document.getElementById("articles");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = normalize(searchInput.value.trim());
      applyFilters();
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        query = "";
        applyFilters();
        searchInput.blur();
      }
    });
  }

  document.querySelectorAll(".tag[data-tag]").forEach(function (tag) {
    tag.addEventListener("click", function (e) {
      e.preventDefault();
      const val = tag.getAttribute("data-tag") || "";
      const filter = tag.getAttribute("data-filter");
      if (filter) {
        const chip = document.querySelector('.chip[data-filter="' + filter + '"]');
        if (chip) chip.click();
      }
      if (searchInput && val) {
        searchInput.value = val;
        query = normalize(val);
        applyFilters();
      }
      const hero = document.getElementById("blog-top");
      if (hero) hero.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (menuToggle && navlinks) {
    menuToggle.addEventListener("click", function () {
      const open = navlinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  applyFilters();
})();

/* WA-SCHEDULE-08-17-6597-ELSE-4909 */
(function () {
  "use strict";
  var WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var PHONE_TEXT_RE = /(\+90\s+)(?:545\s+590\s+65\s+97|532\s+136\s+49\s+09)|(\+90)(?:5455906597|5321364909)|(0)(?:545\s+590\s+65\s+97|532\s+136\s+49\s+09)|(0)(?:5455906597|5321364909)|(90)(?:5455906597|5321364909)|(545\s+590\s+65\s+97|532\s+136\s+49\s+09)/g;

  function getScheduleConfig(customDate) {
    var now = customDate instanceof Date ? customDate : (window.__GUNCAN_TEST_NOW ? new Date(window.__GUNCAN_TEST_NOW) : new Date());
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Istanbul",
      weekday: "short",
      hour: "numeric",
      hour12: false
    }).formatToParts(now);
    var wk = "", hour = -1;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type === "weekday") wk = parts[i].value;
      if (parts[i].type === "hour") hour = parseInt(parts[i].value, 10) % 24;
    }
    var day = Object.prototype.hasOwnProperty.call(WEEKDAYS, wk) ? WEEKDAYS[wk] : -1;
    var isWorkHours = (day >= 1 && day <= 5) && (hour >= 8 && hour < 17);
    return isWorkHours ? {
      isWorkHours: true,
      weekday: wk,
      day: day,
      hour: hour,
      waNum: "905455906597",
      telHref: "tel:+905455906597",
      displayZero: "0545 590 65 97",
      displayIntl: "+90 545 590 65 97",
      displayCompact: "+905455906597",
      displayZeroCompact: "05455906597",
      displayShort: "545 590 65 97"
    } : {
      isWorkHours: false,
      weekday: wk,
      day: day,
      hour: hour,
      waNum: "905321364909",
      telHref: "tel:+905321364909",
      displayZero: "0532 136 49 09",
      displayIntl: "+90 532 136 49 09",
      displayCompact: "+905321364909",
      displayZeroCompact: "05321364909",
      displayShort: "532 136 49 09"
    };
  }

  function rewriteWaHref(href, waNum) {
    if (!href) return href;
    return href
      .replace(/(https?:\/\/(?:www\.)?wa\.me\/)\+?\d+/i, "$1" + waNum)
      .replace(/(wa\.me\/)\+?\d+/i, "$1" + waNum)
      .replace(/([?&]phone=)\+?\d+/i, "$1" + waNum)
      .replace(/905455906597|905321364909|05455906597|05321364909/g, waNum);
  }

  function replacePhoneText(text, cfg) {
    if (!text) return text;
    return text.replace(PHONE_TEXT_RE, function (m, pIntlSp, pIntl, pZeroSp, pZero, p90, pShort) {
      if (pIntlSp) return cfg.displayIntl;
      if (pIntl) return cfg.displayCompact;
      if (pZeroSp) return cfg.displayZero;
      if (pZero) return cfg.displayZeroCompact;
      if (p90) return cfg.waNum;
      if (pShort) return cfg.displayShort;
      return m;
    });
  }

  function updateTextNodes(root, cfg) {
    if (!root) return;
    if (typeof document.createTreeWalker === "function") {
      var walker = document.createTreeWalker(root, 4, null, false);
      var node;
      while ((node = walker.nextNode())) {
        var parentTag = node.parentNode && node.parentNode.nodeName ? node.parentNode.nodeName.toUpperCase() : "";
        if (parentTag === "SCRIPT" || parentTag === "STYLE" || parentTag === "NOSCRIPT" || parentTag === "TEXTAREA") continue;
        var val = node.nodeValue;
        if (val && (val.indexOf("545") !== -1 || val.indexOf("532") !== -1)) {
          var nextVal = replacePhoneText(val, cfg);
          if (nextVal !== val) node.nodeValue = nextVal;
        }
      }
    } else if (root.textContent && (root.textContent.indexOf("545") !== -1 || root.textContent.indexOf("532") !== -1)) {
      root.textContent = replacePhoneText(root.textContent, cfg);
    }
  }

  function applyWaSchedule(customDate) {
    var cfg = getScheduleConfig(customDate);
    var waLinks = document.querySelectorAll('a[href*="wa.me/"], a[href*="whatsapp.com/"]');
    for (var i = 0; i < waLinks.length; i++) {
      var waEl = waLinks[i];
      var oldHref = waEl.getAttribute("href") || "";
      var newHref = rewriteWaHref(oldHref, cfg.waNum);
      if (newHref !== oldHref) waEl.setAttribute("href", newHref);
      updateTextNodes(waEl, cfg);
    }
    var telLinks = document.querySelectorAll('a[href^="tel:"]');
    for (var j = 0; j < telLinks.length; j++) {
      var telEl = telLinks[j];
      if (telEl.getAttribute("href") !== cfg.telHref) {
        telEl.setAttribute("href", cfg.telHref);
      }
      updateTextNodes(telEl, cfg);
    }
    var phoneEls = document.querySelectorAll(".ge-phone, .ci-phone, [data-ge-phone]");
    for (var k = 0; k < phoneEls.length; k++) {
      updateTextNodes(phoneEls[k], cfg);
    }
    if (document.body) {
      updateTextNodes(document.body, cfg);
    }
    return cfg;
  }

  function onDocumentInteract(e) {
    var target = e && e.target;
    if (!target || typeof target.closest !== "function") return;
    var link = target.closest('a[href*="wa.me/"], a[href*="whatsapp.com/"], a[href^="tel:"]');
    if (!link) return;
    var cfg = getScheduleConfig();
    var href = link.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) {
      link.setAttribute("href", cfg.telHref);
    } else if (href.indexOf("wa.me/") !== -1 || href.indexOf("whatsapp.com/") !== -1) {
      link.setAttribute("href", rewriteWaHref(href, cfg.waNum));
    }
    updateTextNodes(link, cfg);
  }

  window.__guncanApplyWaSchedule = applyWaSchedule;
  window.__guncanGetWaSchedule = getScheduleConfig;

  applyWaSchedule();

  if (!window.__guncanWaScheduleBound) {
    window.__guncanWaScheduleBound = true;
    document.addEventListener("pointerdown", onDocumentInteract, true);
    document.addEventListener("click", onDocumentInteract, true);
    document.addEventListener("touchstart", onDocumentInteract, true);
    document.addEventListener("auxclick", onDocumentInteract, true);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { applyWaSchedule(); });
    }
    window.addEventListener("load", function () { applyWaSchedule(); });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) applyWaSchedule();
    });
    setInterval(function () { applyWaSchedule(); }, 60000);
  }
})();
