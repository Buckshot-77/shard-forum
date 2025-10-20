import { randSentence } from '@ngneat/falso'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: randSentence({ length: 3 }).join(' '),
      content: randSentence({ length: 10 }).join(' '),
      ...override,
    },
    id,
  )

  return notification
}
