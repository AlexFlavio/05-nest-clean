import { Either, right } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface FetchQuestionAnswersCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersCaseRequest): Promise<FetchQuestionAnswersCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({
      answers,
    })
  }
}
