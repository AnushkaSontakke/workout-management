import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import {
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getMyWorkouts,
} from '../controller/workout.controller';
const router = express.Router();
router.post('/create', authenticateUser, createWorkout);
router.get('/get', authenticateUser, getMyWorkouts);
router.patch('/update/:workoutId', authenticateUser, updateWorkout);
router.delete('/delete/:workoutId', authenticateUser, deleteWorkout);
export default router;
