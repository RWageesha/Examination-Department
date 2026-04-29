/**
 * Mobile Sidebar (Drawer + Overlay) Toggle
 * Manages the mobile navigation drawer with proper accessibility
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initSidebar);

    function initSidebar() {
        // Get elements
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const sidebarDrawer = document.querySelector('.sidebar-drawer');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const sidebarClose = document.querySelector('.sidebar-close');

        // Exit if elements don't exist (desktop or different page)
        if (!hamburgerBtn || !sidebarDrawer || !sidebarOverlay) {
            return;
        }

        // Focus management
        let lastFocusedElement = null;
        const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

        /**
         * Close any desktop dropdown menus that might be open
         */
        function closeAllDesktopDropdowns() {
            // Close desktop navigation dropdowns
            const desktopDropdowns = document.querySelectorAll('#primary-nav .dropdown.active');
            desktopDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Remove any 'show' classes from Bootstrap-style dropdowns
            const bootstrapDropdowns = document.querySelectorAll('.dropdown-menu.show');
            bootstrapDropdowns.forEach(menu => {
                menu.classList.remove('show');
            });
        }

        /**
         * Open the sidebar drawer
         */
        function openSidebar() {
            // Store the currently focused element
            lastFocusedElement = document.activeElement;

            // Close any desktop dropdowns that might be open
            closeAllDesktopDropdowns();

            // Update button state
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            hamburgerBtn.setAttribute('aria-label', 'Close navigation');

            // Update drawer state
            sidebarDrawer.classList.add('is-open');
            sidebarDrawer.setAttribute('aria-hidden', 'false');

            // Update overlay state
            sidebarOverlay.classList.add('is-open');
            sidebarOverlay.setAttribute('aria-hidden', 'false');

            // Lock body scroll
            document.body.classList.add('no-scroll');

            // Update hamburger icon
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }

            // Focus the first link or close button in sidebar
            setTimeout(() => {
                const firstFocusable = sidebarDrawer.querySelector(focusableSelectors);
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);

            // Set item index for staggered animation
            const navItems = sidebarDrawer.querySelectorAll('.sidebar-nav > ul > li');
            navItems.forEach((li, index) => {
                li.style.setProperty('--item-index', index);
            });
        }

        /**
         * Close the sidebar drawer
         */
        function closeSidebar() {
            // Update button state
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.setAttribute('aria-label', 'Open navigation');

            // Update drawer state
            sidebarDrawer.classList.remove('is-open');
            sidebarDrawer.setAttribute('aria-hidden', 'true');

            // Update overlay state
            sidebarOverlay.classList.remove('is-open');
            sidebarOverlay.setAttribute('aria-hidden', 'true');

            // Unlock body scroll
            document.body.classList.remove('no-scroll');

            // Update hamburger icon
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Restore focus to the element that opened the sidebar
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                setTimeout(() => {
                    lastFocusedElement.focus();
                }, 50);
            }

            // Close any open dropdowns
            const openDropdowns = sidebarDrawer.querySelectorAll('.dropdown.active');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        /**
         * Toggle sidebar state
         */
        function toggleSidebar() {
            const isOpen = sidebarDrawer.classList.contains('is-open');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        /**
         * Handle dropdown toggle inside sidebar
         */
        function handleDropdownClick(e) {
            // Only handle dropdowns on mobile (when sidebar is visible)
            if (window.innerWidth > 1050) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const dropdown = e.currentTarget.closest('.dropdown');
            if (!dropdown) return;

            const isActive = dropdown.classList.contains('active');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');

            // Close other dropdowns in sidebar
            const allDropdowns = sidebarDrawer.querySelectorAll('.dropdown');
            allDropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    const toggle = d.querySelector('.dropdown-toggle');
                    const menu = d.querySelector('.dropdown-menu');
                    if (toggle) {
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                    if (menu) {
                        menu.style.maxHeight = '0px';
                    }
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('active');
            e.currentTarget.setAttribute('aria-expanded', String(!isActive));

            // Animate dropdown menu with calculated height
            if (dropdownMenu) {
                if (!isActive) {
                    // Opening - calculate scrollHeight for smooth animation
                    dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
                } else {
                    // Closing
                    dropdownMenu.style.maxHeight = '0px';
                }
            }
        }

        /**
         * Trap focus within sidebar when open
         */
        function trapFocus(e) {
            if (!sidebarDrawer.classList.contains('is-open')) {
                return;
            }

            if (e.key !== 'Tab') {
                return;
            }

            const focusableElements = sidebarDrawer.querySelectorAll(focusableSelectors);
            if (focusableElements.length === 0) {
                return;
            }

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            // Shift + Tab on first element -> focus last
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
            // Tab on last element -> focus first
            else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }

        /**
         * Handle escape key to close sidebar
         */
        function handleEscape(e) {
            if (e.key === 'Escape' && sidebarDrawer.classList.contains('is-open')) {
                closeSidebar();
            }
        }

        /**
         * Close sidebar when window is resized to desktop
         */
        function handleResize() {
            if (window.innerWidth > 1050 && sidebarDrawer.classList.contains('is-open')) {
                closeSidebar();
            }
        }

        /**
         * Handle navigation link clicks
         */
        function handleNavLinkClick(e) {
            // If link is not a dropdown toggle and not '#', close sidebar after short delay
            const link = e.currentTarget;
            const href = link.getAttribute('href');
            
            if (!link.classList.contains('dropdown-toggle') && href && href !== '#') {
                // Small delay to allow the link to be followed
                setTimeout(closeSidebar, 150);
            }
        }

        // Event listeners
        hamburgerBtn.addEventListener('click', toggleSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', trapFocus);
        window.addEventListener('resize', handleResize);

        // Dropdown toggles
        const dropdownToggles = sidebarDrawer.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', handleDropdownClick);
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleDropdownClick(e);
                }
            });
        });

        // Navigation links (close sidebar on click)
        const navLinks = sidebarDrawer.querySelectorAll('.sidebar-nav a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const allNavLinks = sidebarDrawer.querySelectorAll('.sidebar-nav a');
        
        allNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Home page
            if ((currentPage === '' || currentPage === 'index.html') && 
                (linkHref === '#home' || linkHref === 'index.html')) {
                link.classList.add('active');
            }
            // Other pages
            else if (linkHref && linkHref === currentPage) {
                link.classList.add('active');
            }
        });

        // Initialize dropdown menus with correct max-height
        const dropdownMenus = sidebarDrawer.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(menu => {
            menu.style.maxHeight = '0px';
            menu.style.overflow = 'hidden';
        });

        // Close sidebar when clicking outside on desktop resize
        function handleClickOutside(e) {
            if (window.innerWidth > 1050 && sidebarDrawer.classList.contains('is-open')) {
                closeSidebar();
            }
        }

        document.addEventListener('click', handleClickOutside);
    }

})();
