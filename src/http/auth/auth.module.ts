import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AppConfigService } from 'src/shared/modules/config/config.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory(config: AppConfigService) {
        return { secret: config.applicationConfig.jwtSecret }
      },
    }),
  ],
})
export class AuthModule {}
