import cron from 'node-cron';
import { logPreviousHourWorkoutActivity } from '../services/workout-cron.service';

export const startWorkoutCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Starting hourly workout activity job...');

    try {
      await logPreviousHourWorkoutActivity();
    } catch (error) {
      console.error('Hourly workout activity job failed:', error);
    }
  });

  console.log('Hourly workout cron job scheduled successfully');
};
