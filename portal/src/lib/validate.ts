import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export const createClientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  tempPassword: z
    .string()
    .min(12, "Temporary password must be at least 12 characters")
    .max(200),
  serviceDetails: z
    .string()
    .trim()
    .max(10_000)
    .default("{}")
    .refine((value) => {
      if (value === "") return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, "Service details must be valid JSON"),
});

export const updateClientSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().toLowerCase().email().max(254).optional(),
    tempPassword: z.string().min(12).max(200).optional(),
    serviceDetails: z
      .string()
      .trim()
      .max(10_000)
      .refine((value) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      }, "Service details must be valid JSON")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "No fields to update");
