import { Module } from '@nestjs/common'

import { AppConfigModule } from '../shared/modules/config/config.module'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { PersistenceModule } from './persistence/persistence.module'

@Module({
  imports: [AppConfigModule, AuthModule, HttpModule, PersistenceModule],
})
export class AppModule {}
