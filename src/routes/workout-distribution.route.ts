import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { getWorkoutDistribution } from '../controller/workout-distribution.controller';
const router = Router();
router.get('/', authenticateUser, getWorkoutDistribution);
export default router;
