export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export const BOOKING_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const EXPERIENCE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  EXPERT: "expert",
} as const;

export const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
