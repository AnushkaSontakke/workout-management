import mongoose, { Document } from 'mongoose';

export interface IWorkoutShare extends Document {
  ownerId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  workoutId: mongoose.Types.ObjectId;
  sharedAt: Date;
}

const workoutShareSchema = new mongoose.Schema<IWorkoutShare>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workout owner is required'],
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workout recipient is required'],
    },

    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: [true, 'Workout reference is required'],
    },

    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

workoutShareSchema.index({ workoutId: 1, recipientId: 1 }, { unique: true });

const WorkoutShare = mongoose.model<IWorkoutShare>(
  'WorkoutShare',
  workoutShareSchema,
);

export default WorkoutShare;
