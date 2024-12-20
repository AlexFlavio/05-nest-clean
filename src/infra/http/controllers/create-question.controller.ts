import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common"
import { z } from "zod"

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    await this.createQuestion.execute({
      ...body,
      authorId: userId,
      attachmentsIds: [],
    })
  }
}
