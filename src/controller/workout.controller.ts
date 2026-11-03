import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  createWorkoutService,
  getMyWorkoutsService,
  deleteMyWorkoutService,
  updateMyWorkoutService,
} from '../services/create-workout.service';
import { AuthRequest } from '../middleware/auth.middleware';
export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized User',
      });
    }
    const workout = await createWorkoutService(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'workout created successfully',
      data: workout,
    });
  } catch (error: unknown) {
    console.error('Create workout error:', error);
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to create workout',
    });
  }
};
export const getMyWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Page and limit must be positive integers. Limit cannot exceed 100.',
      });
    }

    const muscle = req.query.muscle as string | undefined;
    const location = req.query.location as string | undefined;

    const result = await getMyWorkoutsService(
      userId,
      page,
      limit,
      muscle,
      location,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to retrieve workouts',
    });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const workoutId = req.params.workoutId;

    if (typeof workoutId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID',
      });
    }

    const workout = await updateMyWorkoutService(workoutId, userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: workout,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to update workout',
    });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const workoutId = req.params.workoutId;

    if (typeof workoutId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID',
      });
    }

    await deleteMyWorkoutService(workoutId, userId);

    return res.status(200).json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to delete workout',
    });
  }
};
