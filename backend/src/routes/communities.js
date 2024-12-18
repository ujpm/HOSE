import express from 'express';
import {
    getCommunities,
    getCommunity,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity,
    handleJoinRequest
} from '../controllers/communities.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getCommunities)
    .post(protect, createCommunity);

router.route('/:id')
    .get(getCommunity)
    .put(protect, updateCommunity)
    .delete(protect, deleteCommunity);

router.route('/:id/join')
    .post(protect, joinCommunity);

router.route('/:id/leave')
    .delete(protect, leaveCommunity);

router.route('/:id/requests/:userId')
    .put(protect, handleJoinRequest);

export default router;
