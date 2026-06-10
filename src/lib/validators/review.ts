import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().optional(),
  userId: z.string().optional(),
  reviewerName: z.string().optional(),
  providerId: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  content: z.string().optional(),
});
