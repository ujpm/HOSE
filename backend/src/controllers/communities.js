import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Community from '../models/Community.js';

// @desc    Get all communities
// @route   GET /api/v1/communities
// @access  Public
export const getCommunities = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single community
// @route   GET /api/v1/communities/:id
// @access  Public
export const getCommunity = asyncHandler(async (req, res, next) => {
    const community = await Community.findById(req.params.id)
        .populate('founder', 'name email')
        .populate('members.user', 'name email')
        .populate('campaigns');

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: community
    });
});

// @desc    Create new community
// @route   POST /api/v1/communities
// @access  Private
export const createCommunity = asyncHandler(async (req, res, next) => {
    // Add user as founder
    req.body.founder = req.user.id;
    
    // Add founder as first member with admin role
    req.body.members = [{
        user: req.user.id,
        role: 'admin'
    }];

    const community = await Community.create(req.body);

    res.status(201).json({
        success: true,
        data: community
    });
});

// @desc    Update community
// @route   PUT /api/v1/communities/:id
// @access  Private
export const updateCommunity = asyncHandler(async (req, res, next) => {
    let community = await Community.findById(req.params.id);

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is admin or founder
    const member = community.members.find(m => m.user.toString() === req.user.id);
    if (!member || (member.role !== 'admin' && community.founder.toString() !== req.user.id)) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this community`,
                401
            )
        );
    }

    community = await Community.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: community
    });
});

// @desc    Delete community
// @route   DELETE /api/v1/communities/:id
// @access  Private
export const deleteCommunity = asyncHandler(async (req, res, next) => {
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is founder
    if (community.founder.toString() !== req.user.id) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this community`,
                401
            )
        );
    }

    await community.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Join community
// @route   POST /api/v1/communities/:id/join
// @access  Private
export const joinCommunity = asyncHandler(async (req, res, next) => {
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is already a member
    if (community.members.some(m => m.user.toString() === req.user.id)) {
        return next(
            new ErrorResponse('User is already a member of this community', 400)
        );
    }

    if (community.isPrivate) {
        // Add join request
        community.joinRequests.push({
            user: req.user.id
        });
    } else {
        // Add user as member
        community.members.push({
            user: req.user.id,
            role: 'member'
        });
    }

    await community.save();

    res.status(200).json({
        success: true,
        data: community
    });
});

// @desc    Leave community
// @route   DELETE /api/v1/communities/:id/leave
// @access  Private
export const leaveCommunity = asyncHandler(async (req, res, next) => {
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is founder
    if (community.founder.toString() === req.user.id) {
        return next(
            new ErrorResponse('Founder cannot leave the community', 400)
        );
    }

    // Remove user from members
    community.members = community.members.filter(
        m => m.user.toString() !== req.user.id
    );

    await community.save();

    res.status(200).json({
        success: true,
        data: community
    });
});

// @desc    Handle join request
// @route   PUT /api/v1/communities/:id/requests/:userId
// @access  Private
export const handleJoinRequest = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(
            new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is admin or founder
    const member = community.members.find(m => m.user.toString() === req.user.id);
    if (!member || (member.role !== 'admin' && community.founder.toString() !== req.user.id)) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to handle join requests`,
                401
            )
        );
    }

    const request = community.joinRequests.find(
        r => r.user.toString() === req.params.userId && r.status === 'pending'
    );

    if (!request) {
        return next(
            new ErrorResponse('No pending join request found for this user', 404)
        );
    }

    request.status = status;

    if (status === 'approved') {
        community.members.push({
            user: req.params.userId,
            role: 'member'
        });
    }

    await community.save();

    res.status(200).json({
        success: true,
        data: community
    });
});
