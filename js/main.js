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

// User state management (anonymous users supported)
const userState = {
    points: 0,
    weeklyPoints: 0,
    level: 1,
    achievements: [],
    quests: [],
    isAnonymous: true,
    userId: null,
    rank: 'Novice'
};

// Level thresholds and titles
const LEVEL_THRESHOLDS = {
    1: { points: 0, title: 'Novice' },
    2: { points: 100, title: 'Explorer' },
    3: { points: 250, title: 'Contributor' },
    4: { points: 500, title: 'Champion' },
    5: { points: 1000, title: 'Master' },
    6: { points: 2000, title: 'Elite' },
    7: { points: 3500, title: 'Legend' },
    8: { points: 5000, title: 'HOSE Celebrity' }
};

// Achievements data
const ACHIEVEMENTS = [
    { id: 'first_campaign', icon: '🌱', name: 'First Campaign', description: 'Join your first campaign', points: 50 },
    { id: 'community_builder', icon: '👥', name: 'Community Builder', description: 'Join 3 communities', points: 100 },
    { id: 'cleanup_hero', icon: '♻️', name: 'Cleanup Hero', description: 'Complete 5 cleanup tasks', points: 200 },
    { id: 'storyteller', icon: '📝', name: 'Storyteller', description: 'Share 3 impact stories', points: 150 },
    { id: 'helper', icon: '🤝', name: 'Helper', description: 'Help 5 community members', points: 125 },
    { id: 'quest_master', icon: '🎯', name: 'Quest Master', description: 'Complete 10 daily quests', points: 300 }
];

// Daily quests data
const DAILY_QUESTS = [
    { id: 'daily_cleanup', title: 'Daily Cleanup', description: 'Pick up 10 pieces of trash', reward: 40, progress: 0, target: 10 },
    { id: 'share_story', title: 'Share Your Impact', description: 'Share one impact story', reward: 75, progress: 0, target: 1 },
    { id: 'help_member', title: 'Community Support', description: 'Help a community member', reward: 25, progress: 0, target: 1 }
];

// Initialize user state
function initializeUser() {
    const savedState = localStorage.getItem('hoseUserState');
    if (savedState) {
        Object.assign(userState, JSON.parse(savedState));
    } else {
        userState.userId = 'anon_' + Math.random().toString(36).substr(2, 9);
        userState.quests = [...DAILY_QUESTS];
        saveUserState();
    }
    updateUI();
    initializeAchievements();
    initializeQuests();
}

// Save user state
function saveUserState() {
    localStorage.setItem('hoseUserState', JSON.stringify(userState));
}

// Update UI elements
function updateUI() {
    // Update points displays
    document.getElementById('points-display').textContent = `${userState.points} HOSE Points`;
    document.getElementById('total-points').textContent = userState.points;
    document.getElementById('weekly-points').textContent = userState.weeklyPoints;
    document.getElementById('user-rank').textContent = userState.rank;

    // Update level progress
    const currentLevel = userState.level;
    const nextLevel = currentLevel + 1;
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel].points;
    const nextThreshold = LEVEL_THRESHOLDS[nextLevel]?.points || currentThreshold;
    const progress = ((userState.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    document.getElementById('current-level').textContent = `Level ${currentLevel}`;
    document.getElementById('next-level').textContent = `Level ${nextLevel}`;
    document.getElementById('level-progress').style.width = `${progress}%`;
    document.getElementById('points-to-next-level').textContent = 
        `${nextThreshold - userState.points} points to next level`;
}

// Initialize achievements
function initializeAchievements() {
    const achievementsGrid = document.getElementById('achievements-list');
    achievementsGrid.innerHTML = ACHIEVEMENTS.map(achievement => `
        <div class="achievement-item ${userState.achievements.includes(achievement.id) ? 'unlocked' : ''}" 
             data-achievement="${achievement.id}"
             title="${achievement.description}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        </div>
    `).join('');
}

// Initialize daily quests
function initializeQuests() {
    const questsList = document.getElementById('daily-quests');
    questsList.innerHTML = userState.quests.map(quest => `
        <div class="quest-item" data-quest="${quest.id}">
            <div class="quest-info">
                <div class="quest-title">${quest.title}</div>
                <div class="quest-progress">${quest.progress}/${quest.target}</div>
            </div>
            <div class="quest-reward">+${quest.reward} pts</div>
        </div>
    `).join('');
}

// Award points
function awardPoints(amount, reason) {
    userState.points += amount;
    userState.weeklyPoints += amount;
    checkLevelUp();
    checkAchievements();
    saveUserState();
    updateUI();
    showNotification(`+${amount} points: ${reason}`);
}

// Check for level up
function checkLevelUp() {
    for (const [level, data] of Object.entries(LEVEL_THRESHOLDS)) {
        if (userState.points >= data.points && userState.level < level) {
            userState.level = parseInt(level);
            userState.rank = data.title;
            showNotification(`🎉 Level Up! You're now ${data.title}`);
            unlockFeatures(level);
        }
    }
}

// Check achievements
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!userState.achievements.includes(achievement.id)) {
            // Mock achievement checks - in real app, would check actual conditions
            if (Math.random() < 0.1) { // 10% chance to unlock achievement for demo
                userState.achievements.push(achievement.id);
                showNotification(`🏆 Achievement Unlocked: ${achievement.name}`);
                awardPoints(achievement.points, `Achievement: ${achievement.name}`);
                initializeAchievements();
            }
        }
    });
}

// Unlock features based on level
function unlockFeatures(level) {
    switch(parseInt(level)) {
        case 5:
            showNotification('🌟 New Feature Unlocked: Create Community Drives!');
            break;
        case 8:
            showNotification('👑 New Feature Unlocked: Become a HOSE Celebrity!');
            break;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Filter rewards by category
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        document.querySelectorAll('.reward-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.textContent.trim().toLowerCase();
        
        switch(action) {
            case 'sign in':
                showNotification('Sign in to save your progress and unlock more features!');
                break;
            case 'get started':
                document.querySelector('#campaigns').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'join campaign':
                awardPoints(50, 'Joined a campaign');
                showNotification('🎉 Welcome to the campaign!');
                break;
            case 'join community':
                awardPoints(30, 'Joined a community');
                showNotification('👋 Welcome to the community!');
                break;
            case 'claim reward':
                const pointsCost = parseInt(e.target.parentElement.querySelector('.reward-progress span').textContent.split('/')[1]);
                if (userState.points >= pointsCost) {
                    userState.points -= pointsCost;
                    saveUserState();
                    updateUI();
                    showNotification('🎁 Reward claimed successfully!');
                } else {
                    showNotification('❌ Not enough points to claim this reward');
                }
                break;
        }
    });
});

// Quest click handler
document.addEventListener('click', (e) => {
    const questItem = e.target.closest('.quest-item');
    if (questItem) {
        const questId = questItem.dataset.quest;
        const quest = userState.quests.find(q => q.id === questId);
        if (quest && quest.progress < quest.target) {
            quest.progress++;
            if (quest.progress >= quest.target) {
                awardPoints(quest.reward, `Completed quest: ${quest.title}`);
                quest.progress = 0; // Reset for demo purposes
            }
            initializeQuests();
            saveUserState();
        }
    }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeUser();
});
