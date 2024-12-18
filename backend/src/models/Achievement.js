import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'participation',
            'leadership',
            'impact',
            'community',
            'milestone',
            'special'
        ]
    },
    pointsValue: {
        type: Number,
        required: [true, 'Please add points value']
    },
    criteria: {
        type: {
            type: String,
            enum: [
                'campaignsCompleted',
                'pointsEarned',
                'communitiesJoined',
                'rewardsClaimed',
                'special'
            ],
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    badge: {
        type: String,
        default: 'default-badge.png'
    },
    rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
        required: true
    },
    unlocks: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate unlocks
AchievementSchema.index({ 'unlocks.user': 1 }, { unique: true });

// Check if user meets achievement criteria
AchievementSchema.methods.checkCriteria = async function(userId) {
    const user = await mongoose.model('User').findById(userId);
    if (!user) return false;

    switch (this.criteria.type) {
        case 'campaignsCompleted':
            return user.campaigns.length >= this.criteria.value;
        case 'pointsEarned':
            return user.points >= this.criteria.value;
        case 'communitiesJoined':
            return user.communities.length >= this.criteria.value;
        case 'rewardsClaimed':
            const rewards = await mongoose.model('Reward')
                .find({ 'claims.user': userId, 'claims.status': 'delivered' });
            return rewards.length >= this.criteria.value;
        case 'special':
            // Special achievements require manual verification
            return false;
        default:
            return false;
    }
};

export default mongoose.model('Achievement', AchievementSchema);
