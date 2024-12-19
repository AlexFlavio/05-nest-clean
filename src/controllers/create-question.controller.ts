import { Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common"
import { CurrentUser } from "src/auth/current-user-decorator"
import { JwtAuthGuard } from "src/auth/jwt.auth.guard"
import { UserPayload } from "src/auth/jwt.strategy"
import { PrismaService } from "src/prisma/prisma.service"
import { z } from "zod"

const createQuestionBodySchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes()
  // new ZodValidationPipe(createQuestionBodySchema)
  async handle(@CurrentUser() user: UserPayload) {
    return "ok"
  }
}
