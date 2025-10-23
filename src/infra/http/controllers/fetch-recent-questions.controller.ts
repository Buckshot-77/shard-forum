import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().max(50).optional().default(20),
})

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query(queryValidationPipe) query: PageQueryParams) {
    const { page, pageSize } = query
    const result = await this.fetchRecentQuestions.execute({
      page,
      pageSize,
    })

    if (result.isLeft())
      throw new InternalServerErrorException('there was an error')

    const presentedQuestions = result.value.questions.map((question) =>
      QuestionPresenter.toHttp(question),
    )

    return { questions: presentedQuestions }
  }
}
