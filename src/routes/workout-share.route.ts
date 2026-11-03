import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';

import {
  shareWorkout,
  unshareWorkout,
  getSharedWorkouts,
} from '../controller/workout-share.controller';

const router = Router();

router.get('/shared', authenticateUser, getSharedWorkouts);

router.post('/:workoutId/share', authenticateUser, shareWorkout);

router.delete(
  '/:workoutId/share/:recipientId',
  authenticateUser,
  unshareWorkout,
);

export default router;
