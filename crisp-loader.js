// Crisp Chat Loader - Standard Implementation
(function(){
  // Wait a moment for crisp-config.js to load if it hasn't yet
  if (typeof window.ENGSITE_CRISP_WEBSITE_ID === 'undefined') {
    setTimeout(arguments.callee, 50);
    return;
  }

  // Get Website ID from config
  var id = (window.ENGSITE_CRISP_WEBSITE_ID || "").trim();
  if (!id) {
    console.warn('Crisp: Website ID not configured');
    return;
  }

  // Check if we should hide on this page
  var shouldHideOnThisPage = false;
  try {
    var opts = window.ENGSITE_CRISP_OPTIONS || {};
    if (Array.isArray(opts.hideOnPages) && opts.hideOnPages.length > 0) {
      var fname = (location.pathname.split("/").pop() || "").toLowerCase();
      shouldHideOnThisPage = opts.hideOnPages.some(function(re){
        try { return re.test(fname); } catch(_) { return false; }
      });
    }
  } catch(_) {}

  if (shouldHideOnThisPage) {
    return;
  }

  // Check if already loaded
  if (document.querySelector('script[src*="client.crisp.chat"]')) {
    // Already loaded, ensure it's visible
    if (window.$crisp && typeof window.$crisp.push === 'function') {
      window.$crisp.push(["do", "chat:show"]);
    }
    return;
  }

  // Standard Crisp initialization - exactly as Crisp recommends
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = id;
  
  (function(){
    var d = document;
    var s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
})();
