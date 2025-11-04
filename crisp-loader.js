(function(){
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

  // If we should hide on this page, don't load Crisp at all
  if (shouldHideOnThisPage) {
    console.log('Crisp: Hidden on this page');
    return;
  }

  // Function to show Crisp chat
  function showCrisp() {
    if (window.$crisp && Array.isArray(window.$crisp)) {
      window.$crisp.push(["do", "chat:show"]);
      console.log('Crisp: Showing chat');
    }
  }

  // Prevent loading Crisp multiple times across page navigations
  if (window.CRISP_LOADED || document.querySelector('script[src*="client.crisp.chat"]')) {
    // Crisp already loaded, just ensure it's visible
    // Check if Crisp is ready (it might be an object or array after initialization)
    if (window.$crisp && (typeof window.$crisp.push === 'function' || typeof window.$crisp === 'object')) {
      setTimeout(function() {
        try {
          if (typeof window.$crisp.push === 'function') {
            window.$crisp.push(["do", "chat:show"]);
          } else if (window.$crisp && window.$crisp.is && typeof window.$crisp.is === 'function') {
            // Crisp is fully initialized
            window.$crisp.push(["do", "chat:show"]);
          }
        } catch(e) {
          console.error('Crisp: Error showing chat on reload', e);
        }
      }, 100);
    } else {
      // Wait a bit more if Crisp isn't ready yet
      setTimeout(function() {
        if (window.$crisp && typeof window.$crisp.push === 'function') {
          showCrisp();
        } else {
          console.warn('Crisp: $crisp object not available');
        }
      }, 1000);
    }
    return;
  }

  // Mark as loading to prevent duplicate loads
  window.CRISP_LOADED = true;

  // Load Crisp - standard initialization pattern
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = id;
  
  var d = document;
  var s = d.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = 1;
  s.onload = function() {
    console.log('Crisp: Script loaded');
    // Wait for Crisp to fully initialize, then show it
    // Try multiple times to ensure it shows
    var attempts = 0;
    var maxAttempts = 5;
    var checkAndShow = function() {
      attempts++;
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        try {
          window.$crisp.push(["do", "chat:show"]);
          console.log('Crisp: Chat shown successfully');
        } catch(e) {
          console.error('Crisp: Error showing chat', e);
        }
      } else if (attempts < maxAttempts) {
        setTimeout(checkAndShow, 500);
      } else {
        console.warn('Crisp: Failed to show after', maxAttempts, 'attempts');
      }
    };
    setTimeout(checkAndShow, 500);
  };
  s.onerror = function() {
    console.error('Crisp: Failed to load script');
    window.CRISP_LOADED = false;
  };
  // Append script immediately
  (d.getElementsByTagName("head")[0] || d.body).appendChild(s);
})();


