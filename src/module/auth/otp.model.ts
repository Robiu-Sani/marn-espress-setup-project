import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      default: Date.now,
      index: { expires: '10m' }, // Automatically deletes after 10 minutes
    },
  },
  { timestamps: true },
);

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);