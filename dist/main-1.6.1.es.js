import "./modules/bilibili-embed-1.6.1.es.js";
import "./modules/resource-link-1.6.1.es.js";
import "./modules/text-box-1.6.1.es.js";
import "./modules/cloud-drive-1.6.1.es.js";
import "./modules/progress-box-1.6.1.es.js";
import "./modules/tabs-1.6.1.es.js";
import "./modules/perspective-view-1.6.1.es.js";
(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload"))
    return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
    i(e);
  new MutationObserver((e) => {
    for (const r of e)
      if (r.type === "childList")
        for (const o of r.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && i(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(e) {
    const r = {};
    return e.integrity && (r.integrity = e.integrity), e.referrerPolicy && (r.referrerPolicy = e.referrerPolicy), e.crossOrigin === "use-credentials" ? r.credentials = "include" : e.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
  }
  function i(e) {
    if (e.ep)
      return;
    e.ep = !0;
    const r = s(e);
    fetch(e.href, r);
  }
})();
