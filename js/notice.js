// Notice popup functionality
function createNoticePopup() {
    const notice = document.createElement('div');
    notice.className = 'notice-popup';
    notice.innerHTML = `
        <div class="notice-content">
            <span class="close-notice">×</span>
            <h3>🚧 Work in Progress! 🌱</h3>
            <p>
                <span class="emoji">🔬</span> From Lab to Tech: A Journey in Progress<br>
                <span class="emoji">💡</span> This project represents the initial phase of HOSE - a vision to merge environmental consciousness with technology.
            </p>
            <p>
                While the frontend is deployed, we're actively working on making the platform even smarter and more impactful!
                <span class="emoji">🚀</span>
            </p>
            <div class="collaboration-call">
                <p>Want to collaborate or support this vision? Reach out!</p>
                <div class="contact-buttons">
                    <a href="mailto:uwizeyimanajp2@gmail.com" class="contact-btn email">
                        <i class="fas fa-envelope"></i>
                        Email
                    </a>
                    <a href="https://linkedin.com/in/ujeanpierre45" target="_blank" class="contact-btn linkedin">
                        <i class="fab fa-linkedin"></i>
                        LinkedIn
                    </a>
                    <a href="tel:+250737787395" class="contact-btn phone">
                        <i class="fas fa-phone"></i>
                        Call
                    </a>
                </div>
            </div>
            <small>Stay tuned for updates! <span class="emoji">✨</span></small>
        </div>
    `;

    document.body.appendChild(notice);

    // Show notice after 3 seconds
    setTimeout(() => {
        notice.classList.add('show');
    }, 3000);

    // Close button functionality
    const closeBtn = notice.querySelector('.close-notice');
    closeBtn.onclick = () => {
        notice.classList.remove('show');
        setTimeout(() => {
            notice.remove();
        }, 300);
    };
}

// Initialize notice when DOM is loaded
document.addEventListener('DOMContentLoaded', createNoticePopup);
