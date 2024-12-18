import express from 'express';
import {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    checkAchievements,
    getUserAchievements
} from '../controllers/achievements.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getAchievements)
    .post(protect, authorize('admin'), createAchievement);

router.route('/:id')
    .get(getAchievement)
    .put(protect, authorize('admin'), updateAchievement)
    .delete(protect, authorize('admin'), deleteAchievement);

router.route('/check')
    .post(protect, checkAchievements);

router.route('/user/:userId')
    .get(getUserAchievements);

export default router;
