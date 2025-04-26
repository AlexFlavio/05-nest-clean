import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

import { QuestionFactory } from "test/factories/make-question"
import { QuestionCommentFactory } from "test/factories/make-question-comment"
import { StudentFactory } from "test/factories/make-student"

describe("Fetch Question Comments (E2E)", () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test("[GET] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    for (let i = 1; i <= 3; i++) {
      await questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: `comment-content-${i}`,
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set("Authorization", `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: "comment-content-1" }),
        expect.objectContaining({ content: "comment-content-2" }),
        expect.objectContaining({ content: "comment-content-3" }),
      ]),
    })
  })
})
