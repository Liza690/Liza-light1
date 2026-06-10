import mongoose, { Schema, Document } from "mongoose";
import { DAYS_OF_WEEK } from "@/lib/constants";

export interface IAvailabilitySlot extends Document {
  tenantId: string;
  providerId: mongoose.Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: Date;
  isBooked: boolean;
  createdAt: Date;
}

const AvailabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    tenantId: { type: String, required: true },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isRecurring: { type: Boolean, default: true },
    specificDate: { type: Date },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AvailabilitySlotSchema.index({ tenantId: 1, providerId: 1, dayOfWeek: 1 });

export default mongoose.models.AvailabilitySlot ||
  mongoose.model<IAvailabilitySlot>("AvailabilitySlot", AvailabilitySlotSchema);
