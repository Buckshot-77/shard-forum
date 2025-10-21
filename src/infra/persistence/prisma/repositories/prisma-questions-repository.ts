import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const foundQuestion = await this.prismaService.question.findUnique({
      where: { id },
    })

    if (!foundQuestion) return null

    return PrismaQuestionMapper.toDomain(foundQuestion)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const foundQuestion = await this.prismaService.question.findUnique({
      where: { slug },
    })
    if (!foundQuestion) return null

    return PrismaQuestionMapper.toDomain(foundQuestion)
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const { page, pageSize } = params
    const foundQuestions = await this.prismaService.question.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: { createdAt: 'desc' },
    })

    const mappedQuestions = foundQuestions.map((question) =>
      PrismaQuestionMapper.toDomain(question),
    )

    return mappedQuestions
  }

  async save(question: Question): Promise<void> {
    const foundQuestion = await this.prismaService.question.findUnique({
      where: { id: question.id.toString() },
    })

    const prismaQuestion = PrismaQuestionMapper.toPrisma(question)

    if (foundQuestion) {
      await this.prismaService.question.update({
        where: { id: question.id.toString() },
        data: prismaQuestion,
      })
      return
    }

    throw new Error('Question does not exist')
  }

  async create(question: Question): Promise<void> {
    const prismaQuestion = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.create({ data: prismaQuestion })
  }

  async delete(question: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: { id: question.id.toString() },
    })
  }
}
