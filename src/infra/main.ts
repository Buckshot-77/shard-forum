import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppConfigService } from '../shared/modules/config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(AppConfigService)

  await app.listen(configService.applicationPort ?? 3333)
}
void bootstrap()
