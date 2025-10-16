import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { env } from './env.schema'

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService<env, true>) {}

  get databaseConfig() {
    return {
      user: this.configService.get('database.user', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      name: this.configService.get('database.name', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
    }
  }

  get databaseUser(): string {
    return this.configService.get('database.user', { infer: true })
  }

  get databasePassword(): string {
    return this.configService.get('database.password', { infer: true })
  }

  get databasePort(): number {
    return this.configService.get('database.port', { infer: true })
  }

  get databaseName(): string {
    return this.configService.get('database.name', { infer: true })
  }

  get databaseUrl(): string {
    return this.configService.get('database.url', { infer: true })
  }

  get databaseHost(): string {
    return this.configService.get('database.host', { infer: true })
  }

  get jwtPrivateKey(): string {
    return this.configService.get('application.jwtPrivateKey', { infer: true })
  }

  get jwtPublicKey(): string {
    return this.configService.get('application.jwtPublicKey', { infer: true })
  }

  get applicationConfig() {
    return {
      port: this.configService.get('application.port', { infer: true }),
      jwtSecret: this.configService.get('application.jwtSecret', {
        infer: true,
      }),
      jwtPrivateKey: this.configService.get('application.jwtPrivateKey', {
        infer: true,
      }),
      jwtPublicKey: this.configService.get('application.jwtPublicKey', {
        infer: true,
      }),
    }
  }

  get applicationPort(): number {
    return this.configService.get('application.port', { infer: true })
  }

  get port(): number {
    return this.applicationPort
  }

  get<T extends keyof env>(key: T): env[T] {
    return this.configService.get(key, { infer: true })
  }
}
