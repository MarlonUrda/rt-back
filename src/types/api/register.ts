import z from "zod"

export const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(25),
  lastName: z.string().min(2).max(25),
})

export const checkEmailSchema = z.object({
  email: z.string().email().toLowerCase(),
})