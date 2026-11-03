import mongoose, { Document } from 'mongoose';

export const WORKOUT_LOCATION = Object.freeze({
  HOME: 'home',
  GYM: 'gym',
  BOTH: 'both',
} as const);

export type WorkoutLocation =
  (typeof WORKOUT_LOCATION)[keyof typeof WORKOUT_LOCATION];

export interface IWorkout extends Document {
  workoutName: string;
  description?: string;
  musclesWorked: string[];
  duration?: number;
  location?: WorkoutLocation;
  userId: mongoose.Types.ObjectId;
}

const workoutSchema = new mongoose.Schema<IWorkout>(
  {
    workoutName: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.length > 0,
        message: 'Workout name cannot be empty',
      },
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    musclesWorked: {
      type: [String],
      required: [true, 'Muscles worked is required'],
      validate: {
        validator: (muscles: string[]) =>
          Array.isArray(muscles) &&
          muscles.length > 0 &&
          muscles.every(
            (muscle) => typeof muscle === 'string' && muscle.trim().length > 0,
          ),
        message: 'At least one valid muscle must be provided',
      },
    },

    duration: {
      type: Number,
      required: false,
      min: [0.01, 'Duration must be a positive number'],
    },

    location: {
      type: String,
      enum: {
        values: Object.values(WORKOUT_LOCATION),
        message: 'Location must be home, gym, or both',
      },
      required: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workout must belong to a user'],
    },
  },
  {
    timestamps: true,
  },
);

const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;
