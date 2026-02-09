import { z } from "zod";

export const requestSchema = z.object({
  hospitalName: z.string().min(1, "This field is required"),
  patientName: z.string().min(1, "This field is required"),
  bloodType: z.string().min(1, "This field is required"),
  unitsRequested: z.number().min(1, "This field is required"),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type RequestData = z.infer<typeof requestSchema>;
