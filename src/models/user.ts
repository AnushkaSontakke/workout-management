import mongoose, { Schema, model, Document } from 'mongoose';
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passKey: string;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passKey: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model<IUser>('User', userSchema);
export default User;
