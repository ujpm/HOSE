// Dashboard State
const dashboardState = {
    user: {
        name: 'Eco Warrior',
        level: 5,
        points: 2450,
        nextLevelPoints: 3000
    },
    charts: {},
    quests: [
        {
            title: 'Beach Guardian',
            description: 'Clean up 5kg of beach waste',
            icon: 'fa-water',
            progress: 60,
            reward: 100
        },
        {
            title: 'Tree Planter',
            description: 'Plant 3 trees this week',
            icon: 'fa-tree',
            progress: 33,
            reward: 150
        },
        {
            title: 'Eco Educator',
            description: 'Share 5 environmental tips',
            icon: 'fa-graduation-cap',
            progress: 80,
            reward: 75
        }
    ],
    achievements: [
        { icon: '🌊', title: 'Ocean Guardian', description: 'Clean 100kg of ocean waste' },
        { icon: '🌳', title: 'Forest Friend', description: 'Plant 50 trees' },
        { icon: '♻️', title: 'Recycling Pro', description: 'Recycle 1000kg of waste' },
        { icon: '📚', title: 'Eco Educator', description: 'Share 100 environmental tips' }
    ],
    activities: [
        { user: 'Sarah', action: 'completed beach cleanup', points: 50, time: '2m ago' },
        { user: 'Mike', action: 'planted 3 trees', points: 75, time: '15m ago' },
        { user: 'Emma', action: 'shared recycling tips', points: 30, time: '1h ago' }
    ]
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    updateUserInfo();
    initializeCharts();
    loadQuests();
    loadAchievements();
    loadActivities();
    animateStats();
}

// Update User Information
function updateUserInfo() {
    document.getElementById('userName').textContent = dashboardState.user.name;
    document.getElementById('totalPoints').textContent = dashboardState.user.points;
    document.getElementById('userLevel').textContent = `Level ${dashboardState.user.level}`;
    
    const progress = ((dashboardState.user.points % 1000) / 1000) * 100;
    document.getElementById('levelProgress').style.width = `${progress}%`;
}

// Initialize Charts
function initializeCharts() {
    initializeImpactChart();
    initializeCommunityChart();
}

function initializeImpactChart() {
    const ctx = document.getElementById('impactChart')?.getContext('2d');
    if (!ctx) return;

    dashboardState.charts.impact = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Environmental Impact',
                data: [65, 78, 90, 85, 95, 110],
                borderColor: '#3B82F6',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeCommunityChart() {
    const ctx = document.getElementById('communityChart')?.getContext('2d');
    if (!ctx) return;

    dashboardState.charts.community = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Beach Cleanup', 'Tree Planting', 'Recycling', 'Education'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#8B5CF6',
                    '#F59E0B'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

// Load Quests
function loadQuests() {
    const questsList = document.getElementById('questsList');
    if (!questsList) return;

    questsList.innerHTML = dashboardState.quests.map(quest => `
        <div class="quest-card animate-slide-up">
            <div class="quest-icon">
                <i class="fas ${quest.icon}"></i>
            </div>
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${quest.progress}%"></div>
            </div>
            <div class="quest-reward">
                <i class="fas fa-star"></i>
                <span>${quest.reward} points</span>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.quest-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('quest-card-active');
            setTimeout(() => card.classList.remove('quest-card-active'), 200);
        });
    });
}

// Load Achievements
function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;

    achievementsList.innerHTML = dashboardState.achievements.map(achievement => `
        <div class="achievement-card animate-slide-up" title="${achievement.description}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
        </div>
    `).join('');
}

// Load Activities
function loadActivities() {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;

    activityFeed.innerHTML = dashboardState.activities.map(activity => `
        <div class="activity-item animate-slide-up">
            <div class="activity-content">
                <strong>${activity.user}</strong> ${activity.action}
                <span class="activity-time">${activity.time}</span>
            </div>
            <div class="activity-points">
                <i class="fas fa-star"></i>
                <span>+${activity.points}</span>
            </div>
        </div>
    `).join('');
}

// Animate Stats
function animateStats() {
    const stats = [
        { element: 'totalPoints', value: dashboardState.user.points },
        { element: 'userLevel', prefix: 'Level ', value: dashboardState.user.level },
        { element: 'levelProgress', value: ((dashboardState.user.points % 1000) / 1000) * 100 }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.element);
        if (!element) return;

        if (stat.element === 'levelProgress') {
            element.style.width = `${stat.value}%`;
        } else {
            let current = 0;
            const increment = stat.value / 50;
            const interval = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                    current = stat.value;
                    clearInterval(interval);
                }
                element.textContent = stat.prefix ? 
                    `${stat.prefix}${Math.floor(current)}` : 
                    Math.floor(current).toLocaleString();
            }, 20);
        }
    });
}

// Export dashboard functionality
window.HOSE = {
    ...window.HOSE,
    dashboard: {
        updateUserInfo,
        loadQuests,
        loadAchievements,
        loadActivities,
        animateStats
    }
};
