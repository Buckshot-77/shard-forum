/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import argon2 from 'argon2'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/persistence/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe Authenticate Test User',
        email: 'johndoe_authentication@example.com',
        passwordHash: await argon2.hash('thisisaverystrongpassword'),
      },
    })

    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe Authenticate Test User',
      email: 'johndoe_authentication@example.com',
      password: 'thisisaverystrongpassword',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe_authentication@example.com',
      password: 'thisisaverystrongpassword',
    })
    expect(response.statusCode).toBe(201)
    expect(response.body.access_token).toBeTruthy()
  })
})
