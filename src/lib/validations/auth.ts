import { z } from "zod";

// Bangladesh mobile phone number regex: accepts 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX
export const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters long.")
      .max(100, "Full name cannot exceed 100 characters."),
    phone: z
      .string()
      .trim()
      .regex(
        bdPhoneRegex,
        "Please enter a valid Bangladesh mobile number (e.g., 01712345678 or +8801712345678)."
      ),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .optional()
      .or(z.literal("")),
    divisionId: z.string().min(1, "Please select your division."),
    districtId: z.string().min(1, "Please select your district."),
    upazilaId: z.string().min(1, "Please select your thana / upazila."),
    address: z.string().trim().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(bdPhoneRegex, "Please enter a valid Bangladesh phone number."),
  otp: z
    .string()
    .trim()
    .length(6, "Verification code must be exactly 6 digits.")
    .regex(/^\d{6}$/, "Verification code must contain only numbers."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const loginOtpRequestSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      bdPhoneRegex,
      "Please enter a valid Bangladesh mobile number (e.g., 01712345678 or +8801712345678)."
    ),
});

export type LoginOtpRequestInput = z.infer<typeof loginOtpRequestSchema>;

export const loginOtpVerifySchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(bdPhoneRegex, "Please enter a valid Bangladesh phone number."),
  otp: z
    .string()
    .trim()
    .length(6, "Verification code must be exactly 6 digits.")
    .regex(/^\d{6}$/, "Verification code must contain only numbers."),
});

export type LoginOtpVerifyInput = z.infer<typeof loginOtpVerifySchema>;

export const passwordLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Please enter your email address or mobile number."),
  password: z
    .string()
    .min(1, "Please enter your account password."),
});

export type PasswordLoginInput = z.infer<typeof passwordLoginSchema>;
