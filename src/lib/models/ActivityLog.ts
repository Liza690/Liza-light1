import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  tenantId: string;
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    tenantId: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ tenantId: 1, createdAt: -1 });
ActivityLogSchema.index({ tenantId: 1, entityType: 1, entityId: 1 });

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
