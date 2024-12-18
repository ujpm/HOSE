// Shared State Management
const sharedState = {
    user: null,
    points: 0,
    notifications: [],
    currentPage: null
};

// Navigation Management
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeFooterAnimations();
    handleUserMenu();
    setupMobileMenu();
});

function initializeNavigation() {
    // Set active nav item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const path = link.getAttribute('href');
        if (currentPath === path) {
            link.setAttribute('data-active', 'true');
        }
    });

    // Add scroll animations
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navContent = document.querySelector('.nav-content');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navContent?.classList.toggle('active');

        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content') && !e.target.closest('.hamburger-menu')) {
            hamburger?.classList.remove('active');
            navContent?.classList.remove('active');
        }
    });
}

function handleUserMenu() {
    const userToggle = document.querySelector('.user-toggle');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                userDropdown.classList.remove('active');
            }
        });
    }
}

// Footer Animations
function initializeFooterAnimations() {
    const footerSections = document.querySelectorAll('.footer-section');
    const updateItems = document.querySelectorAll('.update-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    footerSections.forEach(section => observer.observe(section));
    updateItems.forEach(item => {
        item.classList.add('hover-zoom');
        observer.observe(item);
    });
}

// Points Animation
function updatePoints(newPoints) {
    const pointsDisplay = document.getElementById('navPointsDisplay');
    if (!pointsDisplay) return;

    const currentPoints = parseInt(sharedState.points);
    const difference = newPoints - currentPoints;
    
    if (difference === 0) return;

    // Create floating animation
    const floatingPoints = document.createElement('div');
    floatingPoints.className = 'floating-points';
    floatingPoints.textContent = difference > 0 ? `+${difference}` : difference;
    pointsDisplay.appendChild(floatingPoints);

    // Animate points counter
    let start = currentPoints;
    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.round(start + (difference * progress));
        pointsDisplay.querySelector('span').textContent = `${current} Points`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            sharedState.points = newPoints;
            floatingPoints.addEventListener('animationend', () => {
                floatingPoints.remove();
            });
        }
    }

    requestAnimationFrame(updateCounter);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate-slide-in`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    const container = document.querySelector('.notifications-container') || createNotificationContainer();
    container.appendChild(notification);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Export shared functionality
window.HOSE = {
    updatePoints,
    showNotification,
    state: sharedState
};
