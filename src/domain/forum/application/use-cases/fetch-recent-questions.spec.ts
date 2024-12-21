import { makeQuestion } from "test/factories/make-question"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { FetchRecentQuestionsCase } from "./fetch-recent-questions"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsCase

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsCase(inMemoryQuestionsRepository)
  })

  it("should be able to fetch recent questions", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 12, 14) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 12, 12) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 12, 16) }),
    )

    const results = await sut.execute({
      page: 1,
    })
    expect(results.value?.questions).toHaveLength(3)
    expect(results.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 12, 16) }),
      expect.objectContaining({ createdAt: new Date(2024, 12, 14) }),
      expect.objectContaining({ createdAt: new Date(2024, 12, 12) }),
    ])
  })

  it("should be able to paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const results = await sut.execute({
      page: 2,
    })

    expect(results.value?.questions).toHaveLength(2)
  })
})
