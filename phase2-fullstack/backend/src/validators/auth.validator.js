import { z } from "zod";

const nameRule = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters")
  .max(20, "cannot exceed 20 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters");

const avatarRule = z
  .string()
  .trim()
  .regex(
    /\.(png|jpe?g|webp)$/i,
    "Avatar must be a png, jpg, jpeg or webp image",
  )
  .pipe(z.url("Invalid avatar URL"))
  .optional();

export const signupSchema = z.strictObject({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Must be at least 3 characters")
    .max(20, "cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  fullname: z.strictObject({
    firstname: nameRule,
    lastname: nameRule,
  }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character (e.g., !@#$%)",
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email address format")),

  avatar: avatarRule,
});

export const loginSchema = z.strictObject({
  identifier: z.string().trim().min(1).max(50).toLowerCase(),
  password: z.string().min(1).max(100),
});

export const updateUserSchema = z
  .strictObject({
    fullname: z.strictObject({
      firstname: nameRule,
      lastname: nameRule,
    }),
    avatar: avatarRule,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
