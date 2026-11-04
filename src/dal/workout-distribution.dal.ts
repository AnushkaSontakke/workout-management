import mongoose from 'mongoose';
import Workout from '../models/workout.model';
import WorkoutShare from '../models/workout-share.model';

export const getCreatedWorkoutDistribution = async (
  userId: mongoose.Types.ObjectId,
  fromDate: Date,
  toDate: Date,
) => {
  const result = await Workout.aggregate([
    {
      $match: {
        userId,
        createdAt: {
          $gte: fromDate,
          $lt: toDate,
        },
      },
    },
    {
      $facet: {
        locationDistribution: [
          {
            $match: {
              location: { $exists: true, $ne: null },
            },
          },
          {
            $group: {
              _id: '$location',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              location: '$_id',
              count: 1,
            },
          },
          { $sort: { location: 1 } },
        ],

        muscleDistribution: [
          {
            $unwind: '$musclesWorked',
          },
          {
            $group: {
              _id: '$musclesWorked',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              muscle: '$_id',
              count: 1,
            },
          },
          { $sort: { muscle: 1 } },
        ],
      },
    },
  ]);

  return result[0];
};

export const getSharedWorkoutDistribution = async (
  recipientId: mongoose.Types.ObjectId,
  fromDate: Date,
  toDate: Date,
) => {
  const result = await WorkoutShare.aggregate([
    {
      $match: {
        recipientId,
        sharedAt: {
          $gte: fromDate,
          $lt: toDate,
        },
      },
    },
    {
      $lookup: {
        from: Workout.collection.name,
        localField: 'workoutId',
        foreignField: '_id',
        as: 'workout',
      },
    },
    {
      $unwind: '$workout',
    },
    {
      $facet: {
        locationDistribution: [
          {
            $match: {
              'workout.location': { $exists: true, $ne: null },
            },
          },
          {
            $group: {
              _id: '$workout.location',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              location: '$_id',
              count: 1,
            },
          },
          { $sort: { location: 1 } },
        ],

        muscleDistribution: [
          {
            $unwind: '$workout.musclesWorked',
          },
          {
            $group: {
              _id: '$workout.musclesWorked',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              muscle: '$_id',
              count: 1,
            },
          },
          { $sort: { muscle: 1 } },
        ],
      },
    },
  ]);

  return result[0];
};
