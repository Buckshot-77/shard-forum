import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { CurrentUser } from '../../auth/current-user.decorator'
import type { UserPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = body

    const userId = user.sub

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new InternalServerErrorException(
        'There was an error creating the question',
      )
    }

    const id = result.value.question.id.toValue()

    return { id }
  }
}
