import mongoose, { Schema, Document } from "mongoose";
import { ROLES } from "@/lib/constants";

export interface IUser extends Document {
  tenantId: string;
  email: string;
  phone?: string;
  passwordHash: string;
  name: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  isVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    tenantId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
