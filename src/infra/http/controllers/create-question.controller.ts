import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
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
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: userId,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }
}