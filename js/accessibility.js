/* ============================================
   ACCESSIBILITY.JS - Accessibility Controls
   ============================================ */

(function() {
  const btn = document.getElementById('accessibilityBtn');
  const panel = document.getElementById('accessibilityPanel');
  const html = document.documentElement;

  if (!btn || !panel) return;

  // Toggle panel
  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Load saved preferences
  const savedSize = localStorage.getItem('textSize') || 'normal';
  const savedTheme = localStorage.getItem('theme') || 'auto';
  const savedContrast = localStorage.getItem('contrast') || 'normal';
  const savedMotion = localStorage.getItem('motion') || 'normal';

  // Apply saved text size
  if (savedSize === 'larger') html.classList.add('text-larger');
  if (savedSize === 'largest') html.classList.add('text-largest');

  // Apply saved theme
  if (savedTheme === 'light') html.classList.add('theme-light');
  if (savedTheme === 'dark') html.classList.add('theme-dark');

  // Apply saved contrast
  if (savedContrast === 'high') html.classList.add('high-contrast');

  // Apply saved motion preference
  if (savedMotion === 'reduced') html.classList.add('reduce-motion');

  // Update active buttons
  document.querySelectorAll('[data-size]').forEach(btn => {
    if (btn.dataset.size === savedSize) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  
  document.querySelectorAll('[data-theme]').forEach(btn => {
    if (btn.dataset.theme === savedTheme) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  
  document.querySelectorAll('[data-contrast]').forEach(btn => {
    if (btn.dataset.contrast === savedContrast) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  
  document.querySelectorAll('[data-motion]').forEach(btn => {
    if (btn.dataset.motion === savedMotion) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Text size controls
  document.querySelectorAll('[data-size]').forEach(button => {
    button.addEventListener('click', () => {
      const size = button.dataset.size;

      // Remove all size classes
      html.classList.remove('text-larger', 'text-largest');

      // Add new size class
      if (size === 'larger') html.classList.add('text-larger');
      if (size === 'largest') html.classList.add('text-largest');

      // Save preference
      localStorage.setItem('textSize', size);

      // Update active state
      document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Theme controls
  document.querySelectorAll('[data-theme]').forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.dataset.theme;

      // Remove all theme classes
      html.classList.remove('theme-light', 'theme-dark');

      // Add new theme class
      if (theme === 'light') html.classList.add('theme-light');
      if (theme === 'dark') html.classList.add('theme-dark');

      // Save preference
      localStorage.setItem('theme', theme);

      // Update active state
      document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // High contrast controls
  document.querySelectorAll('[data-contrast]').forEach(button => {
    button.addEventListener('click', () => {
      const contrast = button.dataset.contrast;

      // Remove high contrast class
      html.classList.remove('high-contrast');

      // Add high contrast if selected
      if (contrast === 'high') html.classList.add('high-contrast');

      // Save preference
      localStorage.setItem('contrast', contrast);

      // Update active state
      document.querySelectorAll('[data-contrast]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Reduce motion controls
  document.querySelectorAll('[data-motion]').forEach(button => {
    button.addEventListener('click', () => {
      const motion = button.dataset.motion;

      // Remove reduce motion class
      html.classList.remove('reduce-motion');

      // Add reduce motion if selected
      if (motion === 'reduced') html.classList.add('reduce-motion');

      // Save preference
      localStorage.setItem('motion', motion);

      // Update active state
      document.querySelectorAll('[data-motion]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Auto-detect prefers-reduced-motion on page load
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && savedMotion === 'normal') {
    html.classList.add('reduce-motion');
    document.querySelectorAll('[data-motion]').forEach(btn => {
      if (btn.dataset.motion === 'reduced') btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }
})();

