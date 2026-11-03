import mongoose from 'mongoose';
import WorkoutShare, { IWorkoutShare } from '../models/workout-share.model';

export const createWorkoutShare = async (shareData: Partial<IWorkoutShare>) => {
  return WorkoutShare.create(shareData);
};

export const findWorkoutShare = async (
  workoutId: mongoose.Types.ObjectId,
  recipientId: mongoose.Types.ObjectId,
) => {
  return WorkoutShare.findOne({ workoutId, recipientId });
};

export const deleteWorkoutShare = async (
  workoutId: mongoose.Types.ObjectId,
  ownerId: mongoose.Types.ObjectId,
  recipientId: mongoose.Types.ObjectId,
) => {
  return WorkoutShare.findOneAndDelete({
    workoutId,
    ownerId,
    recipientId,
  });
};

export const findSharedWorkouts = async (
  recipientId: mongoose.Types.ObjectId,
  skip: number,
  limit: number,
) => {
  return WorkoutShare.find({ recipientId })
    .populate('workoutId')
    .populate('ownerId', 'name email')
    .sort({ sharedAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countSharedWorkouts = async (
  recipientId: mongoose.Types.ObjectId,
) => {
  return WorkoutShare.countDocuments({ recipientId });
};
