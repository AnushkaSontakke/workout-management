import express from 'express';
import userRoutes from './routes/userRoutes';
import workoutRoutes from './routes/workout.route';
import WorkoutShare from './routes/workout-share.route';
import workoutAnalyticsRoutes from './routes/workout-statistics.route';
import workoutDistributionRoute from './routes/workout-distribution.route';
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workouts', WorkoutShare);
app.use('/api/workouts/analytics', workoutAnalyticsRoutes);
app.use('/api/workouts/distribution', workoutDistributionRoute);
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'workout management api is running',
  });
});

export default app;
