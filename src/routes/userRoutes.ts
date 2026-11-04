import express from 'express';
import {
  registerUser,
  loginUser,
  resetPassword,
} from '../controller/usercontroller';
const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
export default router;
