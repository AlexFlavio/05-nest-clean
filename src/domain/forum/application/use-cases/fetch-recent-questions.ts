import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

interface FetchRechentQuestionsCaseRequest {
  page: number
}

type FetchRechentQuestionsCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsCase {
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
