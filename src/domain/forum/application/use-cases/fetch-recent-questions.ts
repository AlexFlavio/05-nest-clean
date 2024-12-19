import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { Either, right } from "@/core/either"

interface FetchRechentQuestionsCaseRequest {
  page: number
}

type FetchRechentQuestionsCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRechentQuestionsCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRechentQuestionsCaseRequest): Promise<FetchRechentQuestionsCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
