import express from 'express';
import {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    joinCampaign,
    leaveCampaign
} from '../controllers/campaigns.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getCampaigns)
    .post(protect, createCampaign);

router.route('/:id')
    .get(getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

router.route('/:id/join')
    .post(protect, joinCampaign);

router.route('/:id/leave')
    .delete(protect, leaveCampaign);

export default router;
