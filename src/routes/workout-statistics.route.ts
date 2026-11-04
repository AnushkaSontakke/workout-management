import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';

import { getWorkoutAnalytics } from '../controller/workout-statistics.controller';

const router = Router();

router.get('/', authenticateUser, getWorkoutAnalytics);

export default router;
