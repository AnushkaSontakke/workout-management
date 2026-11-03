import mongoose from 'mongoose';
import Workout from '../models/workout.model';
import { findUserByEmail } from '../dal/user.dal';

import {
  createWorkoutShare,
  deleteWorkoutShare,
  findSharedWorkouts,
  countSharedWorkouts,
} from '../dal/workout-share.dal';

const validateObjectId = (id: string, fieldName: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }

  return new mongoose.Types.ObjectId(id);
};

export const shareWorkoutService = async (
  workoutId: string,
  ownerId: string,
  recipientEmail: string,
) => {
  const workoutObjectId = validateObjectId(workoutId, 'workout ID');
  const ownerObjectId = validateObjectId(ownerId, 'owner ID');

  if (!recipientEmail || !recipientEmail.trim()) {
    throw new Error('Recipient email is required');
  }

  const workout = await Workout.findOne({
    _id: workoutObjectId,
    userId: ownerObjectId,
  });

  if (!workout) {
    throw new Error('Workout not found or you are not the owner');
  }

  const recipient = await findUserByEmail(recipientEmail.trim().toLowerCase());

  if (!recipient) {
    throw new Error('Recipient user is not registered');
  }

  if (recipient._id.toString() === ownerObjectId.toString()) {
    throw new Error('You cannot share a workout with yourself');
  }

  try {
    const sharedWorkout = await createWorkoutShare({
      ownerId: ownerObjectId,
      recipientId: recipient._id,
      workoutId: workoutObjectId,
    });

    return sharedWorkout;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Workout is already shared with this user');
    }

    throw error;
  }
};

export const unshareWorkoutService = async (
  workoutId: string,
  ownerId: string,
  recipientId: string,
) => {
  const workoutObjectId = validateObjectId(workoutId, 'workout ID');
  const ownerObjectId = validateObjectId(ownerId, 'owner ID');
  const recipientObjectId = validateObjectId(recipientId, 'recipient ID');

  const workout = await Workout.findOne({
    _id: workoutObjectId,
    userId: ownerObjectId,
  });

  if (!workout) {
    throw new Error('Workout not found or you are not the owner');
  }

  const deletedShare = await deleteWorkoutShare(
    workoutObjectId,
    ownerObjectId,
    recipientObjectId,
  );

  if (!deletedShare) {
    throw new Error('Sharing record not found');
  }

  return deletedShare;
};

export const getSharedWorkoutsService = async (
  recipientId: string,
  page: number,
  limit: number,
) => {
  const recipientObjectId = validateObjectId(recipientId, 'recipient ID');

  const skip = (page - 1) * limit;

  const [workouts, total] = await Promise.all([
    findSharedWorkouts(recipientObjectId, skip, limit),
    countSharedWorkouts(recipientObjectId),
  ]);

  return {
    workouts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
