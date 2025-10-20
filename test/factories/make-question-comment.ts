import { randText } from '@ngneat/falso'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const question = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: randText(),
      ...override,
    },
    id,
  )

  return question
}
