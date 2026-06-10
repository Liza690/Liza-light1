import mongoose, { Schema, Document } from "mongoose";
import { BOOKING_STATUSES } from "@/lib/constants";

export interface IServiceSnapshot {
  serviceId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  duration: number;
  category?: string;
}

export interface IBooking extends Document {
  tenantId: string;
  bookingId: string;
  userId?: mongoose.Types.ObjectId;
  customerName?: string;
  customerPhone?: string;
  providerId: mongoose.Types.ObjectId;
  serviceIds: mongoose.Types.ObjectId[];
  servicesSnapshot: IServiceSnapshot[];
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  currency: string;
  status: (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSnapshotSchema = new Schema<IServiceSnapshot>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    category: { type: String },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    tenantId: { type: String, required: true },
    bookingId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String },
    customerPhone: { type: String },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    servicesSnapshot: [ServiceSnapshotSchema],
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUSES),
      default: BOOKING_STATUSES.PENDING,
    },
    cancellationReason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ tenantId: 1, userId: 1, createdAt: -1 });
BookingSchema.index({ tenantId: 1, providerId: 1, status: 1 });
BookingSchema.index({ tenantId: 1, serviceIds: 1 });
// Prevent double-bookings at the DB level
BookingSchema.index(
  { tenantId: 1, providerId: 1, date: 1, startTime: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } },
  }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
