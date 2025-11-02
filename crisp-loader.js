(function(){
  var id = (window.ENGSITE_CRISP_WEBSITE_ID || "").trim();
  if (!id) {
    // Not configured yet
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

  // Crisp will provide its own chat widget, no placeholder needed

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


