/* Progressive enhancements: content, navigation and ordering work without JS. */
(() => {
  'use strict';
  const menu = document.querySelector('#mobile-nav');
  const summary = menu?.querySelector('summary');
  const desktop = window.matchMedia('(min-width: 901px)');
  const closeMenu = (restoreFocus = false) => {
    if (!menu?.open) return;
    menu.open = false;
    if (restoreFocus) summary.focus();
  };
  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      } else summary.focus();
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (menu?.open && !menu.contains(event.target)) closeMenu();
  });
  desktop.addEventListener?.('change', (event) => { if (event.matches) closeMenu(); });

  // Content is visible by default, even if the observer or JavaScript fails.
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }

  const mapButton = document.querySelector('[data-load-map]');
  if (mapButton) {
    mapButton.hidden = false;
    mapButton.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.title = 'Lalpotu Collection location on Google Maps';
      frame.src = mapButton.dataset.mapSrc;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      mapButton.closest('.map-panel').replaceChildren(frame);
      frame.focus();
    }, { once: true });
  }

  const dialog = document.querySelector('#reel-dialog');
  const reelButton = document.querySelector('[data-open-reel]');
  if (dialog && reelButton && typeof dialog.showModal === 'function') {
    const player = dialog.querySelector('.reel-player');
    reelButton.hidden = false;
    reelButton.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = player.dataset.reelSrc;
      frame.title = 'Lalpotu Collection organza designer saree reel on Instagram';
      frame.allow = 'encrypted-media; fullscreen';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(frame);
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      player.replaceChildren();
      document.body.classList.remove('dialog-open');
      reelButton.focus({ preventScroll: true });
    });
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
