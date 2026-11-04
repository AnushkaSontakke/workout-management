import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

import { getWorkoutAnalyticsService } from '../services/workout-statistics.service';

export const getWorkoutAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const from = req.query.from;
    const to = req.query.to;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Both from and to dates are required',
      });
    }

    const result = await getWorkoutAnalyticsService(userId, from, to);

    return res.status(200).json({
      success: true,
      message: 'Workout analytics fetched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to fetch workout analytics',
    });
  }
};
