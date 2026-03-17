// Responsive navigation toggle logic
// - Toggles a class on <nav> to open/close the mobile menu
// - Updates aria-expanded on the hamburger button
// - Closes the menu when clicking outside or when a nav link is clicked

(function () {
    const nav = document.querySelector('header nav');
    const toggleBtn = document.querySelector('.hamburger-icon');
    const navLinks = nav ? nav.querySelectorAll('.nav-links a') : [];
    const OPEN_CLASS = 'nav-open';

    if (!nav || !toggleBtn) {
        // Nothing to do if markup is missing
        return;
    }

    function isOpen() {
        return nav.classList.contains(OPEN_CLASS);
    }

    function setOpen(open) {
        nav.classList.toggle(OPEN_CLASS, open);
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggleBtn.classList.toggle('active', open);
    }

    // Toggle on button click
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!isOpen());
    });

    // Keyboard accessibility: Space/Enter toggles the menu (button already handles this, but keep for robustness)
    toggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!isOpen());
        }
    });

    // Close when clicking a link (useful on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
        if (!isOpen()) return;
        // If the click target is inside the nav, ignore
        if (nav.contains(e.target)) return;
        setOpen(false);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            setOpen(false);
            toggleBtn.focus();
        }
    });

    // Ensure menu state resets on resize to avoid stuck-open desktop menu
    window.addEventListener('resize', () => {
        // If viewport is wide enough, remove open state
        // Use a conservative width (e.g., 800px) — adjust to match your CSS breakpoints
        if (window.innerWidth > 800 && isOpen()) {
            setOpen(false);
        }
    });
})();
