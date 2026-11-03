import {
  createWorkout,
  getWorkoutsByUserId,
  deleteWorkoutById,
  updateWorkoutById,
  countWorkoutsByUserId,
} from '../dal/workout.dal';
import { IWorkout } from '../models/workout.model';
import mongoose, { mongo } from 'mongoose';
import { WORKOUT_LOCATION } from '../models/workout.model';
interface CreateWorkoutData {
  workoutName: string;
  description?: string;
  musclesWorked: string[];
  location?: string;
  duration?: number;
}

export const createWorkoutService = async (
  workoutData: CreateWorkoutData,
  userId: string,
) => {
  const { workoutName, description, musclesWorked, location, duration } =
    workoutData;

  if (!workoutName || !workoutName.trim()) {
    throw new Error('Workout name is required');
  }

  if (
    !Array.isArray(musclesWorked) ||
    musclesWorked.length === 0 ||
    musclesWorked.some((muscle) => typeof muscle !== 'string' || !muscle.trim())
  ) {
    throw new Error('At least one valid muscle must be provided');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const workout = await createWorkout({
    workoutName,
    description,
    musclesWorked,
    location: location as IWorkout['location'],
    duration,
    userId: new mongoose.Types.ObjectId(userId),
  });

  return workout;
};
export const getMyWorkoutsService = async (
  userId: string,
  page: number,
  limit: number,
  muscle?: string,
  location?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (muscle) {
    query.musclesWorked = muscle;
  }

  if (location) {
    if (
      !Object.values(WORKOUT_LOCATION).includes(
        location as (typeof WORKOUT_LOCATION)[keyof typeof WORKOUT_LOCATION],
      )
    ) {
      throw new Error('Invalid workout location');
    }

    query.location = location;
  }

  const [workouts, totalRecords] = await Promise.all([
    getWorkoutsByUserId(query, skip, limit),
    countWorkoutsByUserId(query),
  ]);

  return {
    workouts,
    pagination: {
      totalRecords,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
};

export const updateMyWorkoutService = async (
  workoutId: string,
  userId: string,
  updateData: Record<string, unknown>,
) => {
  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    throw new Error('Invalid workout ID');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  delete updateData.userId;

  if (updateData.workoutName !== undefined) {
    if (
      typeof updateData.workoutName !== 'string' ||
      !updateData.workoutName.trim()
    ) {
      throw new Error('Workout name cannot be empty');
    }

    updateData.workoutName = updateData.workoutName.trim();
  }

  if (updateData.musclesWorked !== undefined) {
    if (
      !Array.isArray(updateData.musclesWorked) ||
      updateData.musclesWorked.length === 0 ||
      updateData.musclesWorked.some(
        (muscle) => typeof muscle !== 'string' || !muscle.trim(),
      )
    ) {
      throw new Error('At least one valid muscle must be provided');
    }

    updateData.musclesWorked = updateData.musclesWorked.map((muscle: string) =>
      muscle.trim(),
    );
  }

  const allowedFields = [
    'workoutName',
    'description',
    'musclesWorked',
    'location',
    'duration',
  ];

  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => allowedFields.includes(key)),
  );

  if (Object.keys(filteredData).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  const workout = await updateWorkoutById(workoutId, userId, filteredData);

  if (!workout) {
    throw new Error('Workout not found or you are not authorized to update it');
  }

  return workout;
};

export const deleteMyWorkoutService = async (
  workoutId: string,
  userId: string,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(workoutId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new Error('Invalid workout or user ID');
  }

  const deletedWorkout = await deleteWorkoutById(workoutId, userId);

  if (!deletedWorkout) {
    throw new Error('Workout not found or you are not authorized to delete it');
  }

  return deletedWorkout;
};
