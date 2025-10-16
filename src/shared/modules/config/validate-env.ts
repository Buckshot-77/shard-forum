import { envSchema } from './env.schema'

export const validateEnv = () => {
  const envObject = {
    database: {
      user: process.env.SHARD_DATABASE_USER,
      password: process.env.SHARD_DATABASE_PASSWORD,
      port: process.env.SHARD_DATABASE_PORT,
      name: process.env.SHARD_DATABASE_NAME,
      url: process.env.DATABASE_URL,
      host: process.env.SHARD_DATABASE_HOST,
    },

    application: {
      port: process.env.PORT,
      jwtSecret: process.env.JWT_SECRET,
      jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
      jwtPublicKey: process.env.JWT_PUBLIC_KEY,
    },
  }

  return envSchema.parse(envObject)
}
