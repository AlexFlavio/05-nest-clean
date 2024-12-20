import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Fetch Recent Questions (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Alex Flavio",
        email: "alex@teste.com",
        password: "123456",
      },
    })

    const access_token = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: "Question 01",
          content: "content question 01",
          slug: "question-01",
          authorId: user.id,
        },
        {
          title: "Question 02",
          content: "content question 02",
          slug: "question-02",
          authorId: user.id,
        },
        {
          title: "Question 03",
          content: "content question 03",
          slug: "question-03",
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ slug: "question-01" }),
        expect.objectContaining({ slug: "question-02" }),
        expect.objectContaining({ slug: "question-03" }),
      ],
    })
  })
})
