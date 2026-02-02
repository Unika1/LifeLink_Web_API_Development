import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "staff"]),
  phone: z.string().optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
