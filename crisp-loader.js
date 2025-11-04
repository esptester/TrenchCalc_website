(function(){
  var id = (window.ENGSITE_CRISP_WEBSITE_ID || "").trim();
  if (!id) {
    // Not configured yet
    return;
  }

  // Prevent loading Crisp multiple times across page navigations
  if (window.CRISP_LOADED || document.querySelector('script[src*="client.crisp.chat"]')) {
    // Crisp already loaded, just ensure it's visible
    if (window.$crisp) {
      setTimeout(function() {
        var cookieConsent = document.cookie.match(/cookie_consent=accepted/);
        if (cookieConsent || !document.getElementById('cookieConsentBanner')) {
          window.$crisp.push(["do", "chat:show"]);
        }
      }, 100);
    }
    return;
  }

  // Mark as loading to prevent duplicate loads
  window.CRISP_LOADED = true;

  // Load Crisp
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = id;
  var d = document;
  var s = d.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = 1;
  s.onload = function() {
    // Ensure Crisp chat is visible after loading (wait a bit for initialization)
    setTimeout(function() {
      // Check if cookies were already accepted
      var cookieConsent = document.cookie.match(/cookie_consent=accepted/);
      if (cookieConsent || !document.getElementById('cookieConsentBanner')) {
        // Cookies accepted or no cookie banner - show chat
        if (window.$crisp) {
          window.$crisp.push(["do", "chat:show"]);
        }
      }
    }, 500);
  };
  (d.getElementsByTagName("head")[0] || d.body).appendChild(s);

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


