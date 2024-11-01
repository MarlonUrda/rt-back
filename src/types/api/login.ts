import z from "zod"


export const loginRequestSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
})

export type LoginResponse = {
  token: string
  user: Record<string, any>
}