import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { StudentFactory } from "test/factories/make-student"

describe("Create Question (E2E)", () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        content: "Conteudo da questão de testeeeee",
        title: "Titulo da questão de teste",
      })
    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.question.findFirst({
      where: {
        title: "Titulo da questão de teste",
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
