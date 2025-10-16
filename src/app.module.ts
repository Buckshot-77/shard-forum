import { Module } from '@nestjs/common'

import { PrismaService } from './persistence/prisma/prisma.service'
import { CreateAccountController } from './http/controllers/create-account.controller'
import { AppConfigModule } from './shared/modules/config/config.module'
import { AuthModule } from './http/auth/auth.module'
import { AuthenticateController } from './http/controllers/authenticate.controller'

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
