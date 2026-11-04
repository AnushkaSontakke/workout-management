import mongoose from 'mongoose';
import {
  getCreatedWorkoutDistribution,
  getSharedWorkoutDistribution,
} from '../dal/workout-distribution.dal';

const parseDate = (value: string, fieldName: string): Date => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    throw new Error(`${fieldName} must be in YYYY-MM-DD format`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Invalid ${fieldName} date`);
  }

  return date;
};

export const getWorkoutDistributionService = async (
  userId: string,
  from: string,
  to: string,
) => {
  if (!from || !to) {
    throw new Error('Both from and to dates are required');
  }

  const fromDate = parseDate(from, 'From');
  const endDate = parseDate(to, 'To');

  if (fromDate > endDate) {
    throw new Error('From date cannot be after To date');
  }

  const toDate = new Date(endDate);
  toDate.setUTCDate(toDate.getUTCDate() + 1);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const authenticatedUserId = new mongoose.Types.ObjectId(userId);

  const [created, sharedWithMe] = await Promise.all([
    getCreatedWorkoutDistribution(authenticatedUserId, fromDate, toDate),
    getSharedWorkoutDistribution(authenticatedUserId, fromDate, toDate),
  ]);

  return {
    created,
    sharedWithMe,
  };
};
