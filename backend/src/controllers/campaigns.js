import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Campaign from '../models/Campaign.js';

// @desc    Get all campaigns
// @route   GET /api/v1/campaigns
// @access  Public
export const getCampaigns = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single campaign
// @route   GET /api/v1/campaigns/:id
// @access  Public
export const getCampaign = asyncHandler(async (req, res, next) => {
    const campaign = await Campaign.findById(req.params.id)
        .populate('creator', 'name email')
        .populate('participants.user', 'name email');

    if (!campaign) {
        return next(
            new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: campaign
    });
});

// @desc    Create new campaign
// @route   POST /api/v1/campaigns
// @access  Private
export const createCampaign = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.creator = req.user.id;

    const campaign = await Campaign.create(req.body);

    res.status(201).json({
        success: true,
        data: campaign
    });
});

// @desc    Update campaign
// @route   PUT /api/v1/campaigns/:id
// @access  Private
export const updateCampaign = asyncHandler(async (req, res, next) => {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        return next(
            new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is campaign creator
    if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this campaign`,
                401
            )
        );
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: campaign
    });
});

// @desc    Delete campaign
// @route   DELETE /api/v1/campaigns/:id
// @access  Private
export const deleteCampaign = asyncHandler(async (req, res, next) => {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        return next(
            new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is campaign creator
    if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this campaign`,
                401
            )
        );
    }

    await campaign.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Join campaign
// @route   POST /api/v1/campaigns/:id/join
// @access  Private
export const joinCampaign = asyncHandler(async (req, res, next) => {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        return next(
            new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is already a participant
    if (campaign.participants.some(p => p.user.toString() === req.user.id)) {
        return next(
            new ErrorResponse('User is already a participant in this campaign', 400)
        );
    }

    campaign.participants.push({
        user: req.user.id,
        contribution: req.body.contribution || ''
    });

    await campaign.save();

    res.status(200).json({
        success: true,
        data: campaign
    });
});

// @desc    Leave campaign
// @route   DELETE /api/v1/campaigns/:id/leave
// @access  Private
export const leaveCampaign = asyncHandler(async (req, res, next) => {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        return next(
            new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
        );
    }

    // Remove user from participants
    campaign.participants = campaign.participants.filter(
        p => p.user.toString() !== req.user.id
    );

    await campaign.save();

    res.status(200).json({
        success: true,
        data: campaign
    });
});
