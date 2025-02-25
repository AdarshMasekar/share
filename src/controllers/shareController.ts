import { Request, Response } from 'express';
import Share from '../models/Share';

// @desc    Get all shares
// @route   GET /api/shares
// @access  Private
export const getShares = async (req: Request, res: Response) => {
  try {
    const shares = await Share.find({ owner: req.user.id });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a share
// @route   POST /api/shares
// @access  Private
export const createShare = async (req: Request, res: Response) => {
  try {
    const { title, content, sharedWith } = req.body;

    const share = await Share.create({
      title,
      content,
      owner: req.user.id,
      sharedWith
    });

    res.status(201).json(share);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
