import { z } from "zod";
import { EXPERIENCE_LEVELS } from "@/lib/constants";

export const createProviderSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().optional(),
  city: z.string().min(1),
  languages: z.array(z.string()).optional(),
  experienceLevel: z.enum([
    EXPERIENCE_LEVELS.BEGINNER,
    EXPERIENCE_LEVELS.INTERMEDIATE,
    EXPERIENCE_LEVELS.EXPERT,
  ]).optional(),
  experienceYears: z.number().min(0).optional(),
  age: z.number().min(18).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  profileImages: z.array(z.string()).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().min(15),
  price: z.number().min(0),
  currency: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const createAvailabilitySchema = z.object({
  slots: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      isRecurring: z.boolean().optional(),
      specificDate: z.string().optional(),
    })
  ),
});
