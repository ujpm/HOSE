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
