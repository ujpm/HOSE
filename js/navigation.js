document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');

            // Handle navigation based on href type
            if (href === './') {
                // Home page
                e.preventDefault();
                window.location.href = 'index.html';
            } else if (href.includes('html')) {
                // External pages (about.html, dashboard.html)
                e.preventDefault();
                window.location.href = href;
            } else if (href.startsWith('#')) {
                // Section links within the same page
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    // Add offset for fixed header
                    const headerOffset = 70;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === './')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
