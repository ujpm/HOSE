import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Reward from '../models/Reward.js';
import User from '../models/User.js';

// @desc    Get all rewards
// @route   GET /api/v1/rewards
// @access  Public
export const getRewards = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single reward
// @route   GET /api/v1/rewards/:id
// @access  Public
export const getReward = asyncHandler(async (req, res, next) => {
    const reward = await Reward.findById(req.params.id)
        .populate('claims.user', 'name email');

    if (!reward) {
        return next(
            new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: reward
    });
});

// @desc    Create new reward
// @route   POST /api/v1/rewards
// @access  Private/Admin
export const createReward = asyncHandler(async (req, res, next) => {
    const reward = await Reward.create(req.body);

    res.status(201).json({
        success: true,
        data: reward
    });
});

// @desc    Update reward
// @route   PUT /api/v1/rewards/:id
// @access  Private/Admin
export const updateReward = asyncHandler(async (req, res, next) => {
    let reward = await Reward.findById(req.params.id);

    if (!reward) {
        return next(
            new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
        );
    }

    reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: reward
    });
});

// @desc    Delete reward
// @route   DELETE /api/v1/rewards/:id
// @access  Private/Admin
export const deleteReward = asyncHandler(async (req, res, next) => {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
        return next(
            new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
        );
    }

    await reward.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Claim reward
// @route   POST /api/v1/rewards/:id/claim
// @access  Private
export const claimReward = asyncHandler(async (req, res, next) => {
    const reward = await Reward.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!reward) {
        return next(
            new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if reward is available
    if (!reward.isAvailable()) {
        return next(
            new ErrorResponse('This reward is no longer available', 400)
        );
    }

    // Check if user has already claimed this reward
    if (reward.claims.some(claim => claim.user.toString() === req.user.id)) {
        return next(
            new ErrorResponse('You have already claimed this reward', 400)
        );
    }

    // Check if user has enough points
    if (user.points < reward.pointsCost) {
        return next(
            new ErrorResponse('You do not have enough points to claim this reward', 400)
        );
    }

    // Add claim
    reward.claims.push({
        user: req.user.id
    });

    // Deduct points from user
    user.points -= reward.pointsCost;

    await reward.save();
    await user.save();

    res.status(200).json({
        success: true,
        data: reward
    });
});

// @desc    Update claim status
// @route   PUT /api/v1/rewards/:id/claims/:userId
// @access  Private/Admin
export const updateClaimStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
        return next(
            new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
        );
    }

    const claim = reward.claims.find(
        c => c.user.toString() === req.params.userId
    );

    if (!claim) {
        return next(
            new ErrorResponse('No claim found for this user', 404)
        );
    }

    claim.status = status;

    await reward.save();

    res.status(200).json({
        success: true,
        data: reward
    });
});
