import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodType } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(err),
          statusCode: 400,
          message: 'Validation failed',
        })
      }
    }
  }
}
