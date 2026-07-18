import { z } from "zod";

/** Sign-in accepts an email address OR a username. */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(254)
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^[a-z0-9._-]{3,32}$/.test(v),
      "Enter a valid email or username",
    ),
  password: z.string().min(1).max(200),
});

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9._-]{3,32}$/,
    "Username must be 3–32 characters: letters, numbers, dots, dashes",
  );

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
