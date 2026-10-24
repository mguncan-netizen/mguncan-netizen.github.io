/**
 * Güncan Estetik Blog — minimal SEO helpers
 * OG image fallbacks / canonical sanity checks (client-side soft checks only)
 */
(function (global) {
  "use strict";

  const SITE = "https://blog.guncanestetik.tr";
  const DEFAULT_OG = SITE + "/assets/guncan-estetik-medikal-hero.svg";

  function getMeta(selector) {
    return document.querySelector(selector);
  }

  function ensureCanonical() {
    let link = getMeta('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    if (!link.href) {
      const path = location.pathname.replace(/\/index\.html$/, "/");
      link.href = SITE + path + location.search;
    }
    return link.href;
  }

  function ensureOgImage(fallback) {
    let meta = getMeta('meta[property="og:image"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      document.head.appendChild(meta);
    }
    if (!meta.content) {
      meta.content = fallback || DEFAULT_OG;
    }
    return meta.content;
  }

  function ensureTwitterCard() {
    let card = getMeta('meta[name="twitter:card"]');
    if (!card) {
      card = document.createElement("meta");
      card.setAttribute("name", "twitter:card");
      card.content = "summary_large_image";
      document.head.appendChild(card);
    }
  }

  function softCheck() {
    const issues = [];
    if (!getMeta('meta[property="og:title"]') && !document.title) {
      issues.push("missing-title");
    }
    if (!getMeta('meta[name="description"]')) {
      issues.push("missing-description");
    }
    return issues;
  }

  function init(options) {
    const opts = options || {};
    ensureCanonical();
    ensureOgImage(opts.ogImage || DEFAULT_OG);
    ensureTwitterCard();
    if (opts.debug) {
      const issues = softCheck();
      if (issues.length && typeof console !== "undefined") {
        console.info("[seo.js]", issues);
      }
    }
  }

  global.GuncanSEO = {
    SITE: SITE,
    DEFAULT_OG: DEFAULT_OG,
    ensureCanonical: ensureCanonical,
    ensureOgImage: ensureOgImage,
    ensureTwitterCard: ensureTwitterCard,
    softCheck: softCheck,
    init: init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    }, { once: true });
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : this);
