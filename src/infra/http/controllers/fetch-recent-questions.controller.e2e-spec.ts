/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { randomUUID } from 'node:crypto'

import { PrismaService } from '@/infra/persistence/prisma/prisma.service'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import argon2 from 'argon2'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'

describe('Fetch Recent Questions (E2E)', () => {
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

  test('[GET] /questions', async () => {
    const id = randomUUID()
    const id2 = randomUUID()
    await prisma.user.create({
      data: {
        id,
        name: 'John Doe Create Question test user',
        email: 'johndoe_createquestion@example.com',
        passwordHash: await argon2.hash('thisisaverystrongpassword'),
      },
    })
    await prisma.user.create({
      data: {
        id: id2,
        name: 'Jane Doe',
        email: 'janedoetheseconduser@mail.com',
        passwordHash: await argon2.hash("jane'spasswordissocool"),
      },
    })

    await prisma.question.createMany({
      data: [
        {
          authorId: id2,
          content: 'content 1',
          slug: 'my-slug',
          title: 'my title',
        },
        {
          authorId: id,
          content: 'my content 2',
          slug: 'another-slug',
          title: 'another title',
        },
      ],
    })

    const token = jwt.sign({ sub: id })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set({ Authorization: `Bearer ${token}` })
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.questions.length).toEqual(2)
    expect(response.body.questions).toContainEqual(
      expect.objectContaining({ title: 'my title' }),
    )
    expect(response.body.questions).toContainEqual(
      expect.objectContaining({ title: 'another title' }),
    )
  })
})
