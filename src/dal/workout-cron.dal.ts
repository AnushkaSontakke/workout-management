import Workout from '../models/workout.model';
import WorkoutShare from '../models/workout-share.model';

export const getWorkoutsCreatedInPreviousHour = async () => {
  return Workout.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                '$createdAt',
                {
                  $dateSubtract: {
                    startDate: '$$NOW',
                    unit: 'hour',
                    amount: 1,
                  },
                },
              ],
            },
            {
              $lt: ['$createdAt', '$$NOW'],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$userId',
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getWorkoutsSharedInPreviousHour = async () => {
  return WorkoutShare.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                '$sharedAt',
                {
                  $dateSubtract: {
                    startDate: '$$NOW',
                    unit: 'hour',
                    amount: 1,
                  },
                },
              ],
            },
            {
              $lt: ['$sharedAt', '$$NOW'],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$recipientId',
        count: { $sum: 1 },
      },
    },
  ]);
};
