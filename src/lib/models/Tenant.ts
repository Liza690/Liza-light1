import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
  tenantId: string;
  name: string;
  domain: string;
  customDomain?: string;
  logo?: string;
  primaryColor?: string;
  currency: string;
  whatsappNumber?: string;
  isActive: boolean;
  createdAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    tenantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    customDomain: { type: String },
    logo: { type: String },
    primaryColor: { type: String },
    currency: { type: String, default: "INR" },
    whatsappNumber: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Tenant ||
  mongoose.model<ITenant>("Tenant", TenantSchema);
