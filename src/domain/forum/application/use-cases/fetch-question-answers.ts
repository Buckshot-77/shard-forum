import { Either, right } from '@/core/either'
import { AnswersRepository } from '../repositories//answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
  pageSize?: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
    pageSize,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page, pageSize: pageSize ?? 20 },
    )

    return right({
      answers,
    })
  }
}
