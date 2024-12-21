import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common"
import { z } from "zod"

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
export class AuthenticateController {
  constructor(private autheticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.autheticateStudent.execute({ email, password })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
