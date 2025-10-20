import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigService } from 'src/shared/modules/config/config.service'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.uuid(),
})

export type UserPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: AppConfigService) {
    const publicKey = config.jwtPublicKey
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: UserPayload): UserPayload {
    return tokenSchema.parse(payload)
  }
}
