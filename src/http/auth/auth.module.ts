import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AppConfigService } from 'src/shared/modules/config/config.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      global: true,
      useFactory(config: AppConfigService) {
        return {
          privateKey: Buffer.from(config.jwtPrivateKey, 'base64'),
          publicKey: Buffer.from(config.jwtPublicKey, 'base64'),
          signOptions: { algorithm: 'RS256' },
        }
      },
    }),
  ],
})
export class AuthModule {}
