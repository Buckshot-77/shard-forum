import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PrismaService } from 'src/persistence/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamsSchema = z.coerce.number().min(1).optional().default(1)

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParams) {
    const foundQuestions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: 20 * (page - 1),
    })

    return { questions: foundQuestions }
  }
}
