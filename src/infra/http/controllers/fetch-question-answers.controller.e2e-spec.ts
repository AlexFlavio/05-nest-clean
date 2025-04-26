import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AnswerFactory } from "test/factories/make-answer"
import { QuestionFactory } from "test/factories/make-question"
import { StudentFactory } from "test/factories/make-student"

describe("Fetch Question Answers (E2E)", () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test("[GET] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    for (let i = 1; i <= 3; i++) {
      await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: `answer-content-${i}`,
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set("Authorization", `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: "answer-content-1" }),
        expect.objectContaining({ content: "answer-content-2" }),
        expect.objectContaining({ content: "answer-content-3" }),
      ]),
    })
  })
})
