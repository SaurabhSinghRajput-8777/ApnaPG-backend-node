import { Request, Response } from 'express';
import User from '../models/User.js';
import { UserSyncSchema, UserUpdateSchema } from '../schemas/userSchema.js';

export const syncUser = async (req: Request, res: Response) => {
  try {
    const validatedData = UserSyncSchema.parse(req.body);

    // The 'role' from Clerk is saved here for reference and frontend display.
    // IMPORTANT: This database field is NOT used for backend authorization.
    // Authorization is strictly handled via Clerk JWT metadata in the middleware.
    const user = await User.findOneAndUpdate(
      { clerk_id: validatedData.clerk_id },
      { $set: validatedData },
      { upsert: true, new: true }
    );

    return res.status(201).json(user);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: err.errors });
    }
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(404).json({ error: 'Not Found', message: 'User profile not found. Please sync first.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(404).json({ error: 'Not Found' });
    }

    const validatedData = UserUpdateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: validatedData },
      { new: true }
    );

    return res.json(user);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: err.errors });
    }
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
