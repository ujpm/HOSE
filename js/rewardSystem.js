// Reward System Constants
export const LEVELS = {
    NOVICE: { level: 1, title: "Novice Citizen", pointsRequired: 0 },
    CONTRIBUTOR: { level: 2, title: "Active Contributor", pointsRequired: 100 },
    INNOVATOR: { level: 3, title: "Social Innovator", pointsRequired: 300 },
    LEADER: { level: 4, title: "Community Leader", pointsRequired: 600 },
    MASTER: { level: 5, title: "Master of Change", pointsRequired: 1000 },
    CELEBRITY: { level: 6, title: "HOSE Celebrity", pointsRequired: 2000 },
    LEGEND: { level: 7, title: "Environmental Legend", pointsRequired: 5000 }
};

export const BADGES = {
    WASTE_MASTER: {
        id: "waste_master",
        title: "Waste Master",
        icon: "🗑️",
        description: "Collected over 100kg of waste",
        requirement: { type: "waste_collected", value: 100 }
    },
    GREEN_THUMB: {
        id: "green_thumb",
        title: "Green Thumb",
        icon: "🌱",
        description: "Planted 50 trees",
        requirement: { type: "trees_planted", value: 50 }
    },
    COMMUNITY_HERO: {
        id: "community_hero",
        title: "Community Hero",
        icon: "🦸",
        description: "Organized 5 community events",
        requirement: { type: "events_organized", value: 5 }
    },
    MASTER_CONNECTOR: {
        id: "master_connector",
        title: "Master Connector",
        icon: "🤝",
        description: "Connected 100 people to campaigns",
        requirement: { type: "people_connected", value: 100 }
    },
    ECO_WARRIOR: {
        id: "eco_warrior",
        title: "Eco Warrior",
        icon: "⚔️",
        description: "Completed 20 environmental campaigns",
        requirement: { type: "campaigns_completed", value: 20 }
    }
};

export const QUESTS = {
    DAILY: [
        {
            id: "daily_cleanup",
            title: "Daily Cleanup Hero",
            description: "Collect and properly dispose of 10 pieces of trash",
            reward: { points: 50, type: "daily" },
            requirement: { type: "trash_collected", value: 10 }
        },
        {
            id: "daily_social",
            title: "Daily Social Impact",
            description: "Share one environmental tip on the platform",
            reward: { points: 30, type: "daily" },
            requirement: { type: "tips_shared", value: 1 }
        }
    ],
    WEEKLY: [
        {
            id: "weekly_community",
            title: "Weekly Community Champion",
            description: "Organize or participate in one community event",
            reward: { points: 200, type: "weekly" },
            requirement: { type: "events_participated", value: 1 }
        }
    ],
    SPECIAL: [
        {
            id: "mass_cleanup",
            title: "Mass Cleanup Initiative",
            description: "Lead a campaign that collects over 1000kg of waste",
            reward: { 
                points: 1000, 
                type: "special",
                badge: BADGES.WASTE_MASTER,
                mysteryBox: true
            },
            requirement: { type: "campaign_waste_collected", value: 1000 }
        }
    ]
};

export const MYSTERY_BOX_REWARDS = [
    {
        id: "rare_badge",
        type: "badge",
        rarity: "rare",
        title: "Mystery Badge",
        description: "A rare badge for your outstanding contribution",
        chance: 0.1 // 10% chance
    },
    {
        id: "points_boost",
        type: "points",
        rarity: "common",
        title: "Points Boost",
        description: "Double points for your next activity",
        chance: 0.4 // 40% chance
    },
    {
        id: "special_title",
        type: "title",
        rarity: "uncommon",
        title: "Special Title",
        description: "A unique title for your profile",
        chance: 0.3 // 30% chance
    },
    {
        id: "eco_voucher",
        type: "voucher",
        rarity: "rare",
        title: "Eco-friendly Product Voucher",
        description: "A voucher for sustainable products",
        chance: 0.2 // 20% chance
    }
];

class RewardSystem {
    constructor() {
        this.currentUser = null;
        this.dailyStreak = 0;
        this.lastCheckIn = null;
    }

    // Initialize user's reward state
    initializeUser(user) {
        this.currentUser = user;
        this.loadUserProgress();
    }

    // Load user's progress from storage/API
    loadUserProgress() {
        // This will be replaced with actual API calls
        const progress = localStorage.getItem(`user_progress_${this.currentUser.id}`);
        if (progress) {
            return JSON.parse(progress);
        }
        return {
            points: 0,
            level: 1,
            badges: [],
            completedQuests: [],
            streak: 0,
            lastCheckIn: null
        };
    }

    // Award points for an activity
    awardPoints(activity, points) {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress();
        progress.points += points;

        // Check for level up
        const newLevel = this.checkLevelUp(progress.points);
        if (newLevel > progress.level) {
            this.handleLevelUp(newLevel);
            progress.level = newLevel;
        }

        // Save progress
        this.saveProgress(progress);

        return {
            pointsEarned: points,
            newTotal: progress.points,
            levelUp: newLevel > progress.level
        };
    }

    // Check if user levels up
    checkLevelUp(points) {
        const levels = Object.values(LEVELS).sort((a, b) => b.pointsRequired - a.pointsRequired);
        for (const level of levels) {
            if (points >= level.pointsRequired) {
                return level.level;
            }
        }
        return 1;
    }

    // Handle level up rewards
    handleLevelUp(newLevel) {
        const levelData = Object.values(LEVELS).find(l => l.level === newLevel);
        if (!levelData) return;

        // Award mystery box for level up
        if (newLevel > 1) {
            this.awardMysteryBox();
        }

        return {
            newLevel,
            title: levelData.title,
            rewards: this.getMysteryBoxReward()
        };
    }

    // Award a mystery box
    awardMysteryBox() {
        const reward = this.getMysteryBoxReward();
        const progress = this.loadUserProgress();
        
        progress.mysteryBoxes = progress.mysteryBoxes || [];
        progress.mysteryBoxes.push(reward);
        
        this.saveProgress(progress);
        
        return reward;
    }

    // Get random mystery box reward
    getMysteryBoxReward() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const reward of MYSTERY_BOX_REWARDS) {
            cumulative += reward.chance;
            if (rand <= cumulative) {
                return reward;
            }
        }
        
        return MYSTERY_BOX_REWARDS[MYSTERY_BOX_REWARDS.length - 1];
    }

    // Check and update daily streak
    checkDailyStreak() {
        const progress = this.loadUserProgress();
        const now = new Date();
        const lastCheckIn = progress.lastCheckIn ? new Date(progress.lastCheckIn) : null;

        if (!lastCheckIn) {
            progress.streak = 1;
        } else {
            const daysSinceLastCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastCheckIn === 1) {
                progress.streak += 1;
            } else if (daysSinceLastCheckIn > 1) {
                progress.streak = 1;
            }
        }

        progress.lastCheckIn = now.toISOString();
        this.saveProgress(progress);

        return {
            streak: progress.streak,
            streakBonus: this.calculateStreakBonus(progress.streak)
        };
    }

    // Calculate bonus points for streak
    calculateStreakBonus(streak) {
        // Base bonus of 10 points, with 5 additional points per day of streak
        // Capped at 50 bonus points (8 days streak)
        const bonus = Math.min(10 + (streak - 1) * 5, 50);
        return bonus;
    }

    // Save progress to storage/API
    saveProgress(progress) {
        localStorage.setItem(`user_progress_${this.currentUser.id}`, JSON.stringify(progress));
    }
}

export const rewardSystem = new RewardSystem();
