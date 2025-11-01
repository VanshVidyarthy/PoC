// Responsive sidebar toggle logic
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.querySelector('.sidebar');
const MOBILE_BREAKPOINT = 769; // should mirror CSS media query min-width

function syncSidebarState() {
  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    // Desktop: sidebar always visible
    sidebar.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
  } else {
    // Mobile: collapsed by default
    sidebar.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
}

// Initialize state after DOM ready
window.addEventListener('DOMContentLoaded', syncSidebarState);
window.addEventListener('load', syncSidebarState);

menuBtn?.addEventListener('click', () => {
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    const willShow = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(willShow));
  }
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(syncSidebarState, 120);
});

// Close sidebar when clicking outside (mobile only)
document.addEventListener('click', (e) => {
  if (window.innerWidth >= MOBILE_BREAKPOINT) return; // desktop: ignore
  if (!sidebar.classList.contains('active')) return; // already closed
  const target = e.target;
  if (sidebar.contains(target) || menuBtn.contains(target)) return; // click inside sidebar or on toggle
  sidebar.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
});

// Allow closing with Escape key (mobile only)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.innerWidth < MOBILE_BREAKPOINT && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
  }
});
