import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { QuestionFactory } from "test/factories/make-question"
import { StudentFactory } from "test/factories/make-student"

describe("Fetch Recent Questions (E2E)", () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test("[GET] /questions", async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({ sub: user.id.toString() })

    for (let i = 1; i <= 3; i++) {
      await questionFactory.makePrismaQuestion({
        slug: Slug.create(`question-0${i}`),
        authorId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ slug: "question-03" }),
        expect.objectContaining({ slug: "question-02" }),
        expect.objectContaining({ slug: "question-01" }),
      ],
    })
  })
})
