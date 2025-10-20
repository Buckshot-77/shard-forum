import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { CurrentUser } from '../../auth/current-user.decorator'
import type { UserPayload } from '../../auth/jwt.strategy'
import { PrismaService } from 'src/persistence/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { randomUUID } from 'node:crypto'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = body
    const id = randomUUID()
    let slug: string

    slug = this.titleToSlug(title)

    const foundQuestionBySlug = await this.prisma.question.findUnique({
      where: { slug },
    })

    if (foundQuestionBySlug) {
      const randomStringAuxiliary = randomUUID().split('-')[0]

      slug += randomStringAuxiliary
    }

    await this.prisma.question.create({
      data: {
        id,
        title,
        content,
        authorId: user.sub,
        slug,
      },
    })

    return { id }
  }

  private titleToSlug(title: string): string {
    const slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    if (slug.length <= 72) return slug

    const words = slug.split('-')
    let truncatedSlug = ''

    for (const word of words) {
      if ((truncatedSlug + (truncatedSlug ? '-' : '') + word).length > 72) break
      truncatedSlug += (truncatedSlug ? '-' : '') + word
    }

    return truncatedSlug
  }
}
