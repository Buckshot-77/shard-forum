import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import argon2 from 'argon2'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/persistence/prisma/prisma.service'

const authenticateBodySchema = z.object({
  email: z.email().max(128),
  password: z.string().max(128),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

type AuthenticationReturnPayload = {
  access_token: string
}

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBody,
  ): Promise<AuthenticationReturnPayload> {
    const { email, password } = body

    const foundUser = await this.prisma.user.findUnique({ where: { email } })
    if (!foundUser)
      throw new UnauthorizedException({
        message: 'User credentials do not match',
      })

    const passwordMatch = await argon2.verify(foundUser.passwordHash, password)
    if (!passwordMatch)
      throw new UnauthorizedException({
        message: 'User credentials do not match',
      })

    const token = this.jwt.sign({ sub: foundUser.id })

    return { access_token: token }
  }
}
