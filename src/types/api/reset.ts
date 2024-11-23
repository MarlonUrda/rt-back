import z from 'zod'

const sendResetRequest = z.object({
  email: z.string().email().toLowerCase(),
})

const resetPasswordRequest = z.object({
  code: z.string(),
  password: z.string()
})

const verifyResetCodeRequest = z.object({
  code: z.string()
})