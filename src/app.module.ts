import { Module } from '@nestjs/common'

import { PrismaService } from './persistence/prisma/prisma.service'
import { CreateAccountController } from './http/controllers/create-account.controller'
import { AppConfigModule } from './shared/modules/config/config.module'
import { AuthModule } from './http/auth/auth.module'

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
