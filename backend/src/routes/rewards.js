import express from 'express';
import {
    getRewards,
    getReward,
    createReward,
    updateReward,
    deleteReward,
    claimReward,
    updateClaimStatus
} from '../controllers/rewards.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getRewards)
    .post(protect, authorize('admin'), createReward);

router.route('/:id')
    .get(getReward)
    .put(protect, authorize('admin'), updateReward)
    .delete(protect, authorize('admin'), deleteReward);

router.route('/:id/claim')
    .post(protect, claimReward);

router.route('/:id/claims/:userId')
    .put(protect, authorize('admin'), updateClaimStatus);

export default router;
