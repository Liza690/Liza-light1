import mongoose, { Schema, Document } from "mongoose";
import { EXPERIENCE_LEVELS } from "@/lib/constants";

export interface IServiceProvider extends Document {
  tenantId: string;
  userId?: mongoose.Types.ObjectId;
  name: string;
  bio?: string;
  profileImages: string[];
  city: string;
  languages: string[];
  experienceLevel: (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];
  experienceYears: number;
  age?: number;
  height?: string;
  weight?: string;
  isAvailable: boolean;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    tenantId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    bio: { type: String },
    profileImages: [{ type: String }],
    city: { type: String, required: true },
    languages: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVELS),
      default: EXPERIENCE_LEVELS.BEGINNER,
    },
    experienceYears: { type: Number, default: 0 },
    age: { type: Number },
    height: { type: String },
    weight: { type: String },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ServiceProviderSchema.index({ tenantId: 1, city: 1, isAvailable: 1 });
ServiceProviderSchema.index(
  { tenantId: 1, name: "text", bio: "text", tags: "text" },
  { default_language: "none", language_override: "none" }
);

export default mongoose.models.ServiceProvider ||
  mongoose.model<IServiceProvider>("ServiceProvider", ServiceProviderSchema);
