import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { userInterface } from './user.interface';
import config from '../../config';

const userSchema = new mongoose.Schema<userInterface>(
  {
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default:
        'https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg?semt=ais_hybrid&w=740&q=80',
    },
    number: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, 
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    role: {
      type: String,
      enum: [
        'admin',
        'user',
        'manager',
        'developer',
        'member-ship',
        'super-admin',
      ],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);



// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(Number(config.salt_factor));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

const User = mongoose.model<userInterface>('User', userSchema);

export default User;
