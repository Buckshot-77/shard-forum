import { z } from 'zod'

export const envSchema = z.object({
  database: z.object({
    user: z.string(),
    password: z.string(),
    port: z.coerce.number().optional().default(3333),
    name: z.string(),
    url: z.url(),
    host: z.string(),
  }),

  application: z.object({
    port: z.coerce.number(),
    jwtSecret: z.string(),
    jwtPrivateKey: z.string(),
    jwtPublicKey: z.string(),
  }),
})

export type env = z.infer<typeof envSchema>
