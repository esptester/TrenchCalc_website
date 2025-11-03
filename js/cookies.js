/* ============================================
   COOKIES.JS - Cookie Consent Management
   ============================================ */

(function() {
  'use strict';

  // Cookie consent state
  const COOKIE_CONSENT_KEY = 'cookie_consent';
  const COOKIE_CONSENT_VERSION = '1.0';

  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Set cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Check if consent has been given
  function hasConsent() {
    const consent = getCookie(COOKIE_CONSENT_KEY);
    return consent === 'accepted';
  }

  // Check consent preferences
  function getConsentPreferences() {
    const preferences = localStorage.getItem('cookie_preferences');
    if (preferences) {
      try {
        return JSON.parse(preferences);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Save consent preferences
  function saveConsentPreferences(prefs) {
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    setCookie(COOKIE_CONSENT_KEY, 'accepted', 365);
  }

  // Show cookie banner
  function showCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      console.log('Cookie banner: Showing banner');
      // Ensure banner is visible with initial transform
      banner.style.display = 'block';
      banner.style.transform = 'translateY(100%)';
      // Force reflow to apply the transform
      void banner.offsetHeight;
      // Smooth slide up animation
      setTimeout(() => {
        banner.classList.add('show');
        console.log('Cookie banner: Added show class');
      }, 50);
    } else {
      console.error('Cookie banner: Banner element not found!');
    }
  }

  // Hide cookie banner
  function hideCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 300);
    }
  }

  // Accept all cookies
  function acceptAll() {
    const preferences = {
      necessary: true,
      analytics: true,
      functional: true,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };
    saveConsentPreferences(preferences);
    hideCookieBanner();
    enableAnalytics();
    // Ensure Crisp chat is visible after accepting cookies
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:show']);
    }
    location.reload(); // Reload to ensure Google Analytics initializes
  }

  // Reject non-essential cookies
  function rejectOptional() {
    const preferences = {
      necessary: true,
      analytics: false,
      functional: false,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };
    saveConsentPreferences(preferences);
    hideCookieBanner();
    disableAnalytics();
    // Crisp chat should still work with necessary cookies
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:show']);
    }
  }

  // Custom preferences
  function saveCustomPreferences() {
    const analyticsInput = document.getElementById('cookiePrefAnalyticsInput');
    const functionalInput = document.getElementById('cookiePrefFunctionalInput');
    const analytics = analyticsInput ? analyticsInput.checked : false;
    const functional = functionalInput ? functionalInput.checked : false;
    
    const preferences = {
      necessary: true, // Always required
      analytics: analytics,
      functional: functional,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };
    
    saveConsentPreferences(preferences);
    hideCookieBanner();
    
    // Ensure Crisp chat is visible after saving preferences
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:show']);
    }
    
    if (analytics) {
      enableAnalytics();
      location.reload();
    } else {
      disableAnalytics();
    }
  }

  // Enable Google Analytics
  function enableAnalytics() {
    // Google Analytics is already in the HTML, so we just need to ensure it loads
    // The gtag script should already be there - we might need to reload if it was blocked
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  // Disable Google Analytics
  function disableAnalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }

  // Initialize toggle switches for cookie preferences
  function initToggleSwitches() {
    // Analytics toggle
    const analyticsToggle = document.getElementById('cookiePrefAnalytics');
    const analyticsInput = document.getElementById('cookiePrefAnalyticsInput');
    if (analyticsToggle && analyticsInput) {
      analyticsToggle.addEventListener('click', () => {
        analyticsInput.checked = !analyticsInput.checked;
        analyticsToggle.classList.toggle('active', analyticsInput.checked);
      });
      // Set initial state based on saved preferences
      const preferences = getConsentPreferences();
      if (preferences) {
        analyticsInput.checked = preferences.analytics || false;
        analyticsToggle.classList.toggle('active', analyticsInput.checked);
      }
    }

    // Functional toggle
    const functionalToggle = document.getElementById('cookiePrefFunctional');
    const functionalInput = document.getElementById('cookiePrefFunctionalInput');
    if (functionalToggle && functionalInput) {
      functionalToggle.addEventListener('click', () => {
        functionalInput.checked = !functionalInput.checked;
        functionalToggle.classList.toggle('active', functionalInput.checked);
      });
      // Set initial state based on saved preferences
      const preferences = getConsentPreferences();
      if (preferences) {
        functionalInput.checked = preferences.functional !== false; // Default to true
        functionalToggle.classList.toggle('active', functionalInput.checked);
      }
    }
  }

  // Initialize cookie consent
  function initCookieConsent() {
    console.log('Cookie consent: Initializing...');
    // Initialize toggle switches
    initToggleSwitches();
    
    // Check if consent has been given
    const hasGivenConsent = hasConsent();
    console.log('Cookie consent: Has consent?', hasGivenConsent);
    
    if (!hasGivenConsent) {
      // Show banner after a short delay to ensure DOM is ready
      console.log('Cookie consent: Will show banner in 1 second');
      setTimeout(function() {
        showCookieBanner();
      }, 1000);
    } else {
      console.log('Cookie consent: User has already given consent');
      // Load saved preferences
      const preferences = getConsentPreferences();
      if (preferences && preferences.analytics) {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
      // Ensure Crisp chat is visible if cookies were already accepted
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:show']);
      } else {
        // If Crisp isn't loaded yet, wait a bit and try again
        setTimeout(function() {
          if (window.$crisp) {
            window.$crisp.push(['do', 'chat:show']);
          }
        }, 1000);
      }
    }

    // Set up event listeners
    const acceptBtn = document.getElementById('cookieAcceptAll');
    const rejectBtn = document.getElementById('cookieRejectOptional');
    const customBtn = document.getElementById('cookieSaveCustom');
    const customizeBtn = document.getElementById('cookieCustomize');
    const closeBtn = document.getElementById('cookieClose');
    const cookieSettingsBtn = document.getElementById('cookieSettings');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', acceptAll);
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', rejectOptional);
    }

    if (customBtn) {
      customBtn.addEventListener('click', saveCustomPreferences);
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        const panel = document.getElementById('cookiePreferencesPanel');
        if (panel) {
          panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', hideCookieBanner);
    }

    if (cookieSettingsBtn) {
      cookieSettingsBtn.addEventListener('click', () => {
        showCookieBanner();
        const panel = document.getElementById('cookiePreferencesPanel');
        if (panel) {
          panel.style.display = 'block';
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }
})();

