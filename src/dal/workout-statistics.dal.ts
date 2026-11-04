import mongoose from 'mongoose';
import Workout from '../models/workout.model';
import WorkoutShare, { IWorkoutShare } from '../models/workout-share.model';

export const countWorkoutsCreated = async (
  userId: mongoose.Types.ObjectId,
  fromDate: Date,
  toDate: Date,
) => {
  return Workout.countDocuments({
    userId,
    createdAt: {
      $gte: fromDate,
      $lt: toDate,
    },
  });
};

export const countWorkoutsSharedWithMe = async (
  recipientId: mongoose.Types.ObjectId,
  fromDate: Date,
  toDate: Date,
) => {
  return WorkoutShare.countDocuments({
    recipientId,
    sharedAt: {
      $gte: fromDate,
      $lt: toDate,
    },
  });
};
