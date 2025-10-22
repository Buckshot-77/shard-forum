import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
  pageSize?: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
    pageSize,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page,
      pageSize: pageSize ?? 20,
    })

    return right({
      questions,
    })
  }
}
