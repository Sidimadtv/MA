document.addEventListener('DOMContentLoaded', function () {
    if (window.__TOOLPIX_SIDEBAR_INITIALIZED) return;
    window.__TOOLPIX_SIDEBAR_INITIALIZED = true;

    // Sidebar Elements
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const icon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

    if (!sidebar) return;

    function setIconState() {
        if (!icon) return;

        const isMobile = window.innerWidth <= 768;
        const isMobileOpen = sidebar.classList.contains('active');
        const isCollapsed = sidebar.classList.contains('collapsed');

        icon.classList.remove('fa-bars', 'fa-times', 'fa-indent', 'fa-outdent');

        if (isMobile) {
            icon.classList.add(isMobileOpen ? 'fa-times' : 'fa-bars');
        } else {
            icon.classList.add(isCollapsed ? 'fa-outdent' : 'fa-indent');
        }
    }

    function setAriaExpanded() {
        if (!mobileMenuToggle) return;
        const isMobile = window.innerWidth <= 768;
        const expanded = isMobile ? sidebar.classList.contains('active') : !sidebar.classList.contains('collapsed');
        mobileMenuToggle.setAttribute('aria-expanded', String(expanded));
    }

    // --- 1. Toggle Functionality ---
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');

            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }

        setAriaExpanded();
        setIconState();
    }

    // --- 2. State Restoration ---
    (function restoreSidebarState() {
        localStorage.setItem('sidebarCollapsed', 'false');
        sidebar.classList.remove('collapsed', 'active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        setAriaExpanded();
        setIconState();
    })();

    // --- 3. Resize Handler ---
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            sidebar.classList.remove('collapsed');
            setAriaExpanded();
            setIconState();
        } else {
            sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');

            sidebar.classList.remove('collapsed');
            localStorage.setItem('sidebarCollapsed', 'false');
            setAriaExpanded();
            setIconState();
        }
    });

    // --- 4. Event Listeners ---
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleSidebar);

    // Close on link click (mobile)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // --- 5. Collapsible Sections ---
    // Auto-collapse specific sections on load
    const sectionsToCollapse = [];
    document.querySelectorAll('.sidebar-section .sidebar-title').forEach(title => {
        const sectionName = title.textContent.trim().toUpperCase();
        const section = title.parentElement;
        const sectionIcon = title.querySelector('i');

        // Initial Auto-Collapse
        if (sectionsToCollapse.some(name => sectionName.includes(name)) && sectionIcon && sectionIcon.classList.contains('fa-chevron-down')) {
            section.classList.add('collapsed');
            sectionIcon.classList.remove('fa-chevron-down');
            sectionIcon.classList.add('fa-chevron-right');
        }

        // Click Handler
        title.addEventListener('click', function (e) {
            e.stopPropagation();
            const parentSection = this.parentElement;
            parentSection.classList.toggle('collapsed');

            const icon = this.querySelector('i');
            if (icon) {
                if (parentSection.classList.contains('collapsed')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-right');
                } else {
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });

    // --- 6. Swipe Gestures ---
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const SWIPE_THRESHOLD = 100;
        // Right swipe (open sidebar) - only from left edge
        if (touchEndX - touchStartX > SWIPE_THRESHOLD && touchStartX < 50) {
            if (!sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
        // Left swipe (close sidebar)
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
            if (sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
    }
});
