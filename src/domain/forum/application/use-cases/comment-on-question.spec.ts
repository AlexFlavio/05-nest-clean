import { makeQuestion } from "test/factories/make-question"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CommentOnQuestionUseCase

describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionCommentsRepository,
      inMemoryQuestionsRepository,
    )
  })

  it("should be able to comment on question", async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: "test Comment",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.questionComment.id).toBeTruthy()
      expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
        "test Comment",
      )
      expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(
        result.value?.questionComment.id,
      )
    }
  })
})
