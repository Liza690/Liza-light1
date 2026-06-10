import { z } from "zod";

export const createBookingSchema = z.object({
  providerId: z.string().min(1),
  serviceIds: z.array(z.string().min(1)).min(1),
  date: z.string().datetime({ offset: true }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
