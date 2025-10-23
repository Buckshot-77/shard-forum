import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHttp(entity: Question) {
    const { id, title, slug, content, bestAnswerId, createdAt, updatedAt } =
      entity

    return {
      id,
      title,
      slug: slug.value,
      content,
      best_answer_id: bestAnswerId?.toValue(),
      created_at: createdAt,
      updated_at: updatedAt,
    }
  }
}
