import { Module } from '@nestjs/common'

import { PrismaService } from './persistence/prisma/prisma.service'
import { CreateAccountController } from './http/controllers/create-account.controller'
import { AppConfigModule } from './shared/modules/config/config.module'
import { AuthModule } from './http/auth/auth.module'
import { AuthenticateController } from './http/controllers/authenticate.controller'
import { CreateQuestionController } from './http/controllers/create-question.controller'

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
