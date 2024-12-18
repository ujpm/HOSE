document.addEventListener('DOMContentLoaded', () => {
    // Initialize user data
    initializeUserData();

    // Initialize charts
    initializeCharts();

    // Setup navigation
    setupNavigation();

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    loadDashboardData();
});

// User Data Initialization
function initializeUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Update user info in sidebar
    document.querySelector('.username').textContent = user.name;
    document.querySelector('.points').textContent = `${user.points} Points`;
    document.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
}

// Charts Initialization
function initializeCharts() {
    // Points History Chart
    const pointsCtx = document.getElementById('pointsChart').getContext('2d');
    new Chart(pointsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Points Earned',
                data: [300, 450, 600, 475, 800, 1500],
                borderColor: '#3B82F6',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Activity Overview Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Campaigns', 'Communities', 'Education', 'Other'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.section;

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Load section data if needed
            loadSectionData(targetSection);
        });
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Toggle sidebar on mobile
    document.getElementById('toggleSidebar')?.addEventListener('click', () => {
        document.querySelector('.dashboard-nav').classList.toggle('active');
    });

    // Create Campaign button
    document.getElementById('createCampaign')?.addEventListener('click', () => {
        showCreateCampaignModal();
    });

    // Create Community button
    document.getElementById('createCommunity')?.addEventListener('click', () => {
        showCreateCommunityModal();
    });

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    });
}

// Data Loading Functions
function loadDashboardData() {
    // Load campaigns
    loadCampaigns();
    
    // Load communities
    loadCommunities();
    
    // Load rewards
    loadRewards();
    
    // Load achievements
    loadAchievements();
}

function loadSectionData(section) {
    switch (section) {
        case 'campaigns':
            loadCampaigns();
            break;
        case 'communities':
            loadCommunities();
            break;
        case 'rewards':
            loadRewards();
            break;
        case 'achievements':
            loadAchievements();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Campaign Management
function loadCampaigns() {
    const activeCampaigns = [
        {
            id: 1,
            title: 'Clean Beach Initiative',
            description: 'Help clean local beaches',
            participants: 150,
            points: 500,
            progress: 75
        },
        // Add more campaigns
    ];

    const pastCampaigns = [
        {
            id: 2,
            title: 'Tree Planting Drive',
            description: 'Plant trees in urban areas',
            participants: 200,
            points: 750,
            status: 'Completed'
        },
        // Add more campaigns
    ];

    renderCampaigns(activeCampaigns, pastCampaigns);
}

// Community Management
function loadCommunities() {
    const communities = [
        {
            id: 1,
            name: 'Environmental Warriors',
            members: 3500,
            description: 'Fighting for environmental causes',
            image: 'https://source.unsplash.com/random/300x200/?nature'
        },
        // Add more communities
    ];

    renderCommunities(communities);
}

// Rewards System
function loadRewards() {
    const rewards = [
        {
            id: 1,
            title: 'HOSE Star Badge',
            points: 1000,
            description: 'Exclusive digital badge',
            icon: '🏆'
        },
        // Add more rewards
    ];

    renderRewards(rewards);
}

// Achievements System
function loadAchievements() {
    const achievements = [
        {
            id: 1,
            title: 'Community Champion',
            description: 'Lead 5 successful campaigns',
            progress: 80,
            icon: '👑'
        },
        // Add more achievements
    ];

    renderAchievements(achievements);
}

// Settings Management
function loadSettings() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Load profile settings
    document.getElementById('profileForm').innerHTML = `
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" value="${user.name}" />
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" value="${user.email}" />
        </div>
        <button type="submit" class="btn-primary">Save Changes</button>
    `;

    // Load notification settings
    document.getElementById('notificationForm').innerHTML = `
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" checked />
                Campaign Updates
            </label>
        </div>
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" checked />
                Community Messages
            </label>
        </div>
        <button type="submit" class="btn-primary">Save Preferences</button>
    `;

    // Load privacy settings
    document.getElementById('privacyForm').innerHTML = `
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" checked />
                Public Profile
            </label>
        </div>
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" checked />
                Show Points
            </label>
        </div>
        <button type="submit" class="btn-primary">Update Privacy</button>
    `;
}

// Modal Management
function showCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Create New Campaign</h3>
            <form id="campaignForm">
                <div class="form-group">
                    <label>Campaign Title</label>
                    <input type="text" required />
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea required></textarea>
                </div>
                <div class="form-group">
                    <label>Target Points</label>
                    <input type="number" required />
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeModal('createCampaignModal')" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Create Campaign</button>
                </div>
            </form>
        </div>
    `;
}

function showCreateCommunityModal() {
    const modal = document.getElementById('createCommunityModal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Create New Community</h3>
            <form id="communityForm">
                <div class="form-group">
                    <label>Community Name</label>
                    <input type="text" required />
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea required></textarea>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select required>
                        <option value="environment">Environment</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeModal('createCommunityModal')" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Create Community</button>
                </div>
            </form>
        </div>
    `;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Rendering Functions
function renderCampaigns(active, past) {
    // Implementation for rendering campaigns
}

function renderCommunities(communities) {
    // Implementation for rendering communities
}

function renderRewards(rewards) {
    // Implementation for rendering rewards
}

function renderAchievements(achievements) {
    // Implementation for rendering achievements
}
