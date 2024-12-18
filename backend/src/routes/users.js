import express from 'express';
import { protect } from '../middleware/auth.js';
import { advancedResults } from '../middleware/advancedResults.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
router.get('/', protect, advancedResults(User), async (req, res) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: {} });
});

export default router;
