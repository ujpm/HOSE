import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

// @desc    Get all achievements
// @route   GET /api/v1/achievements
// @access  Public
export const getAchievements = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single achievement
// @route   GET /api/v1/achievements/:id
// @access  Public
export const getAchievement = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id)
        .populate('unlocks.user', 'name email');

    if (!achievement) {
        return next(
            new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: achievement
    });
});

// @desc    Create new achievement
// @route   POST /api/v1/achievements
// @access  Private/Admin
export const createAchievement = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
        success: true,
        data: achievement
    });
});

// @desc    Update achievement
// @route   PUT /api/v1/achievements/:id
// @access  Private/Admin
export const updateAchievement = asyncHandler(async (req, res, next) => {
    let achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        return next(
            new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404)
        );
    }

    achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: achievement
    });
});

// @desc    Delete achievement
// @route   DELETE /api/v1/achievements/:id
// @access  Private/Admin
export const deleteAchievement = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        return next(
            new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404)
        );
    }

    await achievement.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Check user achievements
// @route   POST /api/v1/achievements/check
// @access  Private
export const checkAchievements = asyncHandler(async (req, res, next) => {
    const achievements = await Achievement.find({ isActive: true });
    const user = await User.findById(req.user.id);
    const unlockedAchievements = [];

    for (const achievement of achievements) {
        // Skip if user already has this achievement
        if (achievement.unlocks.some(u => u.user.toString() === req.user.id)) {
            continue;
        }

        // Check if user meets criteria
        const meetsRequirements = await achievement.checkCriteria(req.user.id);

        if (meetsRequirements) {
            // Add achievement to user's unlocks
            achievement.unlocks.push({
                user: req.user.id
            });

            // Add points to user
            user.points += achievement.pointsValue;

            await achievement.save();
            unlockedAchievements.push(achievement);
        }
    }

    if (unlockedAchievements.length > 0) {
        await user.save();
    }

    res.status(200).json({
        success: true,
        data: unlockedAchievements
    });
});

// @desc    Get user achievements
// @route   GET /api/v1/achievements/user/:userId
// @access  Public
export const getUserAchievements = asyncHandler(async (req, res, next) => {
    const achievements = await Achievement.find({
        'unlocks.user': req.params.userId
    });

    res.status(200).json({
        success: true,
        data: achievements
    });
});
