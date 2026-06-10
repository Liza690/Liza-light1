import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  tenantId: string;
  providerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category?: string;
  duration: number;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    tenantId: { type: String, required: true },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ tenantId: 1, providerId: 1, isActive: 1 });

export default mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);
