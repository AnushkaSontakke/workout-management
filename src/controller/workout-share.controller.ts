import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

import {
  shareWorkoutService,
  unshareWorkoutService,
  getSharedWorkoutsService,
} from '../services/workout-share.service';

export const shareWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workoutId = req.params.workoutId;

    if (typeof workoutId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID',
      });
    }

    const { recipientEmail } = req.body;
    const ownerId = req.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await shareWorkoutService(
      workoutId,
      ownerId,
      recipientEmail,
    );

    return res.status(201).json({
      success: true,
      message: 'Workout shared successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to share workout',
    });
  }
};

export const unshareWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workoutId = req.params.workoutId;
    const recipientId = req.params.recipientId;

    if (typeof workoutId !== 'string' || typeof recipientId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID or recipient ID',
      });
    }

    const ownerId = req.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await unshareWorkoutService(workoutId, ownerId, recipientId);

    return res.status(200).json({
      success: true,
      message: 'Workout sharing revoked successfully',
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to revoke workout sharing',
    });
  }
};

export const getSharedWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const recipientId = req.userId;

    if (!recipientId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const result = await getSharedWorkoutsService(recipientId, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Shared workouts fetched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to fetch shared workouts',
    });
  }
};
