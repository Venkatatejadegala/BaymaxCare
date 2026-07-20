import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['patient', 'doctor', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'patient',
    },
  },
  {
    timestamps: true,
  }
);

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export { User };
