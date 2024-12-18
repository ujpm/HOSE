// Navigation active state
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Update active link based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.textContent.trim().toLowerCase();
        
        switch(action) {
            case 'sign in':
                alert('Sign in functionality coming soon!');
                break;
            case 'get started':
                document.querySelector('#campaigns').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'join campaign':
                alert('Campaign joining functionality coming soon!');
                break;
            case 'join community':
                alert('Community joining functionality coming soon!');
                break;
            case 'claim reward':
                alert('Reward claiming functionality coming soon!');
                break;
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .community-card, .reward-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(element);
});

// Authentication state management
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userMenu = document.querySelector('.user-menu');
    const authButton = document.querySelector('.auth-button');
    
    if (user) {
        userMenu.classList.remove('hidden');
        authButton.classList.add('hidden');
        
        // Update user info
        userMenu.querySelector('.points').textContent = `${user.points} Points`;
        userMenu.querySelector('.username').textContent = user.name;
        userMenu.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
    } else {
        userMenu.classList.add('hidden');
        authButton.classList.remove('hidden');
    }
}

// Profile dropdown
document.querySelector('.btn-profile')?.addEventListener('click', () => {
    document.querySelector('.dropdown-menu').classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-auth')) {
        document.querySelector('.dropdown-menu')?.classList.add('hidden');
    }
});

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    updateAuthUI();
});

// Update auth UI on page load
updateAuthUI();
