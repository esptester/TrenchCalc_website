(function(){
  var id = (window.ENGSITE_CRISP_WEBSITE_ID || "").trim();
  if (!id) {
    // Not configured yet; keep placeholder button behavior
    return;
  }

  // Load Crisp
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = id;
  var d = document;
  var s = d.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = 1;
  (d.getElementsByTagName("head")[0] || d.body).appendChild(s);

  // Hide any placeholder chat button if present
  function hidePlaceholder(){
    try {
      var btn = d.getElementById("chatWidgetBtn");
      if (btn) btn.style.display = "none";
    } catch (_) {}
  }
  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", hidePlaceholder);
  } else {
    hidePlaceholder();
  }

  // Optional per-page visibility rules
  try {
    var opts = window.ENGSITE_CRISP_OPTIONS || {};
    if (Array.isArray(opts.hideOnPages) && opts.hideOnPages.length > 0) {
      var fname = (location.pathname.split("/").pop() || "").toLowerCase();
      var shouldHide = opts.hideOnPages.some(function(re){
        try { return re.test(fname); } catch(_) { return false; }
      });
      if (shouldHide) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    }
  } catch(_) {}
})();


