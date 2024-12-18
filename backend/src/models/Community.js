import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    founder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['member', 'moderator', 'admin'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    campaigns: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Campaign'
    }],
    totalPoints: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'environment',
            'education',
            'health',
            'community',
            'technology',
            'other'
        ]
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    joinRequests: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        requestedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate members
CommunitySchema.index({ 'members.user': 1 }, { unique: true });

// Calculate total points when campaigns are updated
CommunitySchema.methods.calculateTotalPoints = async function() {
    const campaigns = await mongoose.model('Campaign').find({
        _id: { $in: this.campaigns }
    });
    
    this.totalPoints = campaigns.reduce((total, campaign) => {
        return total + (campaign.currentPoints || 0);
    }, 0);
    
    await this.save();
};

export default mongoose.model('Community', CommunitySchema);
