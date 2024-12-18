import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.ObjectId,
        ref: 'Community'
    },
    participants: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        contribution: {
            type: String
        },
        points: {
            type: Number,
            default: 0
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    targetPoints: {
        type: Number,
        required: [true, 'Please add target points']
    },
    currentPoints: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'cancelled'],
        default: 'planning'
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per campaign
CampaignSchema.index({ creator: 1, title: 1 }, { unique: true });

// Static method to get avg of points
CampaignSchema.statics.getAveragePoints = async function(campaignId) {
    const obj = await this.aggregate([
        {
            $match: { campaign: campaignId }
        },
        {
            $group: {
                _id: '$campaign',
                averagePoints: { $avg: '$points' }
            }
        }
    ]);

    try {
        await this.model('Campaign').findByIdAndUpdate(campaignId, {
            averagePoints: obj[0].averagePoints
        });
    } catch (err) {
        console.error(err);
    }
};

export default mongoose.model('Campaign', CampaignSchema);
