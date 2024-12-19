import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { makeAnswer } from "test/factories/make-answer"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe("choose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it("should not be able to choose another user question best answer", async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID("author-1") })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    const result = await sut.execute({
      authorId: "author-2",
      answerId: answer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
