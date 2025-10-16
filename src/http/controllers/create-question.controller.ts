import { Controller, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('/questions')
export class CreateQuestionController {
  constructor() {}
  @Post()
  @UseGuards(JwtAuthGuard)
  handle() {
    return 'ok'
  }
}
