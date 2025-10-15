import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'

import argon2 from 'argon2'

import { z } from 'zod'

import { PrismaService } from 'src/persistence/prisma/prisma.service'
import { ZodValidationPipe } from 'src/http/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    const passwordHash = await argon2.hash(password)

    const userWithTheSameEmail = await this.prisma.user.findFirst({
      where: { email: email },
    })

    if (userWithTheSameEmail) {
      throw new ConflictException('user with the same email already exists')
    }

    await this.prisma.user.create({ data: { name, email, passwordHash } })
  }
}
