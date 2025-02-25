import express from 'express';
import { protect } from '../middleware/auth';
import {
  getShares,
  createShare,
  updateShare,
  deleteShare
} from '../controllers/shareController';

const router = express.Router();

router.route('/')
  .get(protect, getShares)
  .post(protect, createShare);

router.route('/:id')
  .put(protect, updateShare)
  .delete(protect, deleteShare);

export default router;
