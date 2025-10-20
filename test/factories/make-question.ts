import { randSentence, randText } from '@ngneat/falso'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: randSentence({ length: 3 }).join(' '),
      content: randText(),
      ...override,
    },
    id,
  )

  return question
}
