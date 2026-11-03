import Workout from '../models/workout.model';
import { IWorkout } from '../models/workout.model';
import mongoose from 'mongoose';
export const createWorkout = async (workoutData: Partial<IWorkout>) => {
  return await Workout.create(workoutData);
};

export const getWorkoutsByUserId = async (
  query: Record<string, unknown>,
  skip: number,
  limit: number,
) => {
  return await Workout.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countWorkoutsByUserId = async (query: Record<string, unknown>) => {
  return await Workout.countDocuments(query);
};

export const updateWorkoutById = async (
  workoutId: string,
  userId: string,
  updateData: Record<string, unknown>,
) => {
  return await Workout.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(workoutId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
};
export const deleteWorkoutById = async (workoutId: string, userId: string) => {
  return await Workout.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(workoutId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};
