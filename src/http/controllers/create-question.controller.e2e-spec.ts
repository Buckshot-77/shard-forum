/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { randomUUID } from 'node:crypto'

import { PrismaService } from '@/persistence/prisma/prisma.service'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import argon2 from 'argon2'
import request from 'supertest'

import { AppModule } from '@/app.module'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  afterEach(async () => {
    await prisma.question.deleteMany({ where: {} })
  })

  test('[POST] /questions', async () => {
    const id = randomUUID()
    await prisma.user.create({
      data: {
        id,
        name: 'John Doe Create Question test user',
        email: 'johndoe_createquestion@example.com',
        passwordHash: await argon2.hash('thisisaverystrongpassword'),
      },
    })

    const token = jwt.sign({ sub: id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'A very cool title',
        content: 'this is my content',
      })
    expect(response.statusCode).toBe(201)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(response.body).toEqual({ id: expect.any(String) })
    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'A very cool title',
      },
    })
    expect(questionOnDatabase).toBeTruthy()
  })
})
