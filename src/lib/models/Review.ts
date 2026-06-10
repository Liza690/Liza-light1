import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  tenantId: string;
  bookingId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  reviewerName?: string;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  content?: string;
  isVerifiedBooking: boolean;
  createdBy: "admin" | "customer";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    tenantId: { type: String, required: true },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewerName: { type: String },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String },
    isVerifiedBooking: { type: Boolean, default: false },
    createdBy: {
      type: String,
      enum: ["admin", "customer"],
      default: "admin",
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ tenantId: 1, providerId: 1, createdAt: -1 });

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
