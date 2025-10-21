import { Question as PrismaQuestion } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    const { id, content, title, createdAt, updatedAt, slug, bestAnswerId } = raw

    const domainQuestion = Question.create(
      {
        authorId: new UniqueEntityID(id),
        content: content,
        title: title,
        attachments: new QuestionAttachmentList([]),
        bestAnswerId: bestAnswerId ? new UniqueEntityID(bestAnswerId) : null,
        createdAt: createdAt,
        updatedAt: updatedAt,
        slug: Slug.create(slug),
      },
      new UniqueEntityID(id),
    )

    return domainQuestion
  }

  static toPrisma(domainEntity: Question): PrismaQuestion {
    const {
      id,
      authorId,
      content,
      createdAt,
      updatedAt,
      slug,
      title,
      bestAnswerId,
    } = domainEntity
    return {
      id: id.toString(),
      authorId: authorId.toString(),
      content,
      slug: slug.value,
      bestAnswerId: bestAnswerId?.toString() ?? null,
      title,
      createdAt,
      updatedAt,
    }
  }
}
