import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
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
    pointsCost: {
        type: Number,
        required: [true, 'Please add points cost']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['digital', 'physical', 'experience', 'donation', 'other']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity available']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    expiryDate: {
        type: Date
    },
    sponsor: {
        type: String
    },
    claims: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        claimedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'delivered'],
            default: 'pending'
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

// Prevent user from claiming same reward multiple times
RewardSchema.index({ 'claims.user': 1 }, { unique: true });

// Check if reward is available
RewardSchema.methods.isAvailable = function() {
    return this.isActive && 
           this.quantity > this.claims.length && 
           (!this.expiryDate || this.expiryDate > Date.now());
};

// Update quantity when reward is claimed
RewardSchema.pre('save', function(next) {
    if (this.claims.length >= this.quantity) {
        this.isActive = false;
    }
    next();
});

export default mongoose.model('Reward', RewardSchema);
