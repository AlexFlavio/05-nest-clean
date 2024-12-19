import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { CommentOnAnswerUseCase } from "./comment-on-answer"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: CommentOnAnswerUseCase

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository,
    )
  })

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: "test Comment",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      "test Comment",
    )

    // expect(inMemoryAnswerCommentsRepository.items[0]).toEqual(result.value)
  })
})
