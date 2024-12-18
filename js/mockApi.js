// Mock API service that mirrors the backend API structure
const mockApi = {
    // User related mock data
    user: {
        profile: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            points: 1500,
            level: "Environmental Warrior",
            badges: ["🌟 Star Contributor", "🌱 Green Pioneer", "♻️ Recycling Champion"]
        }
    },

    // Campaign related mock data
    campaigns: {
        active: [
            {
                id: 1,
                title: "Beach Cleanup Drive",
                description: "Join us in cleaning local beaches",
                participants: 150,
                points: 500,
                progress: 75,
                image: "https://source.unsplash.com/random/800x600/?beach-cleanup"
            },
            {
                id: 2,
                title: "Tree Planting Initiative",
                description: "Help us plant 1000 trees",
                participants: 300,
                points: 750,
                progress: 45,
                image: "https://source.unsplash.com/random/800x600/?tree-planting"
            }
        ],
        past: [
            {
                id: 3,
                title: "Plastic Free Challenge",
                description: "30 days without single-use plastic",
                participants: 500,
                points: 1000,
                status: "Completed",
                image: "https://source.unsplash.com/random/800x600/?plastic-free"
            }
        ]
    },

    // Community related mock data
    communities: [
        {
            id: 1,
            name: "Ocean Guardians",
            members: 3500,
            description: "Protecting our oceans and marine life",
            image: "https://source.unsplash.com/random/800x600/?ocean"
        },
        {
            id: 2,
            name: "Urban Farmers",
            members: 2800,
            description: "Promoting sustainable urban farming",
            image: "https://source.unsplash.com/random/800x600/?urban-farming"
        }
    ],

    // Rewards related mock data
    rewards: {
        levels: LEVELS,
        badges: BADGES,
        quests: QUESTS,
        userProgress: {
            points: 1500,
            level: 4,
            currentTitle: "Community Leader",
            badges: [
                {
                    id: "waste_master",
                    dateEarned: "2024-12-15",
                    progress: 100
                },
                {
                    id: "community_hero",
                    dateEarned: "2024-12-10",
                    progress: 100
                }
            ],
            activeQuests: [
                {
                    id: "daily_cleanup",
                    progress: 7,
                    total: 10,
                    expiresAt: new Date(Date.now() + 86400000).toISOString()
                },
                {
                    id: "weekly_community",
                    progress: 0,
                    total: 1,
                    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
                }
            ],
            streakData: {
                current: 5,
                longest: 12,
                lastCheckIn: new Date(Date.now() - 86400000).toISOString()
            },
            impactStats: {
                wasteCollected: 150,
                treesPlanted: 25,
                eventsOrganized: 3,
                peopleImpacted: 250
            }
        }
    },

    // Achievement related mock data
    achievements: [
        {
            id: 1,
            title: "Community Champion",
            description: "Lead 5 successful community campaigns",
            progress: 80,
            icon: "👑"
        },
        {
            id: 2,
            title: "Waste Warrior",
            description: "Collect 100kg of recyclable waste",
            progress: 65,
            icon: "♻️"
        }
    ],

    // Statistics and analytics mock data
    stats: {
        pointsHistory: [300, 450, 600, 475, 800, 1500],
        activityBreakdown: {
            campaigns: 40,
            communities: 25,
            education: 20,
            other: 15
        },
        recentActivity: [
            {
                id: 1,
                type: "achievement",
                title: "New Achievement",
                description: "Earned Community Champion badge",
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                type: "campaign",
                title: "Campaign Contribution",
                description: "Joined Beach Cleanup Drive",
                timestamp: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    }
};

// Import reward system
import { rewardSystem, LEVELS, BADGES, QUESTS } from './rewardSystem.js';

// Mock API endpoints that mirror the backend API
export const api = {
    // User endpoints
    async getUserProfile() {
        return mockApi.user.profile;
    },

    // Campaign endpoints
    async getCampaigns() {
        return {
            active: mockApi.campaigns.active,
            past: mockApi.campaigns.past
        };
    },

    async joinCampaign(campaignId) {
        return { success: true, message: "Successfully joined campaign" };
    },

    // Community endpoints
    async getCommunities() {
        return mockApi.communities;
    },

    async joinCommunity(communityId) {
        return { success: true, message: "Successfully joined community" };
    },

    // Rewards endpoints
    async getRewards() {
        return mockApi.rewards;
    },

    async claimReward(rewardId) {
        const reward = mockApi.rewards.find(r => r.id === rewardId);
        if (!reward) {
            throw new Error('Reward not found');
        }

        return {
            success: true,
            reward: reward,
            message: `Successfully claimed ${reward.title}`
        };
    },

    // Achievement endpoints
    async getAchievements() {
        return mockApi.achievements;
    },

    // Statistics endpoints
    async getStats() {
        return mockApi.stats;
    },

    // Reward system endpoints
    async getUserProgress() {
        return mockApi.rewards.userProgress;
    },

    async checkDailyStreak() {
        const streak = rewardSystem.checkDailyStreak();
        return {
            streak: streak.streak,
            bonus: streak.streakBonus,
            lastCheckIn: new Date().toISOString()
        };
    },

    async completeQuest(questId) {
        const quest = [...QUESTS.DAILY, ...QUESTS.WEEKLY, ...QUESTS.SPECIAL]
            .find(q => q.id === questId);
        
        if (!quest) {
            throw new Error('Quest not found');
        }

        // Simulate quest completion
        return {
            success: true,
            rewards: {
                points: quest.reward.points,
                badge: quest.reward.badge,
                mysteryBox: quest.reward.mysteryBox ? rewardSystem.getMysteryBoxReward() : null
            }
        };
    },

    async getAvailableQuests() {
        return {
            daily: QUESTS.DAILY,
            weekly: QUESTS.WEEKLY,
            special: QUESTS.SPECIAL
        };
    },

    async getLeaderboard(type = 'global', timeFrame = 'weekly') {
        return {
            type,
            timeFrame,
            leaders: [
                {
                    userId: 1,
                    name: "Jane Doe",
                    points: 2500,
                    level: 5,
                    badges: 8,
                    impactStats: {
                        wasteCollected: 300,
                        treesPlanted: 50
                    }
                },
                {
                    userId: 2,
                    name: "John Smith",
                    points: 2200,
                    level: 4,
                    badges: 6,
                    impactStats: {
                        wasteCollected: 250,
                        treesPlanted: 40
                    }
                }
            ]
        };
    }
};
