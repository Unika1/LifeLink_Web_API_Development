import { z } from "zod";

export const hospitalSchema = z.object({
  name: z.string().min(2, "Hospital name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  isActive: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const hospitalUpdateSchema = z.object({
  name: z.string().min(2, "Hospital name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  isActive: z.boolean().optional(),
});

export type HospitalFormSchema = z.infer<typeof hospitalSchema>;
