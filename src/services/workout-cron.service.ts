import {
  getWorkoutsCreatedInPreviousHour,
  getWorkoutsSharedInPreviousHour,
} from '../dal/workout-cron.dal';

export const logPreviousHourWorkoutActivity = async () => {
  const [createdWorkouts, sharedWorkouts] = await Promise.all([
    getWorkoutsCreatedInPreviousHour(),
    getWorkoutsSharedInPreviousHour(),
  ]);

  const userActivity = new Map<
    string,
    {
      workoutsCreated: number;
      workoutsSharedWithMe: number;
    }
  >();

  for (const item of createdWorkouts) {
    const userId = item._id.toString();

    userActivity.set(userId, {
      workoutsCreated: item.count,
      workoutsSharedWithMe: 0,
    });
  }

  for (const item of sharedWorkouts) {
    const userId = item._id.toString();

    const existingActivity = userActivity.get(userId) ?? {
      workoutsCreated: 0,
      workoutsSharedWithMe: 0,
    };

    existingActivity.workoutsSharedWithMe = item.count;

    userActivity.set(userId, existingActivity);
  }

  for (const [userId, activity] of userActivity) {
    console.log({
      userId,
      workoutsCreated: activity.workoutsCreated,
      workoutsSharedWithMe: activity.workoutsSharedWithMe,
    });
  }

  console.log('Hourly workout activity job completed');
};
