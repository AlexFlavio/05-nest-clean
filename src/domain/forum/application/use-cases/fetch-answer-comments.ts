import { Either, right } from "@/core/either"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"

interface FetchAnswerCommentsCaseRequest {
  page: number
  answerId: string
}

type FetchAnswerCommentsCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsCaseRequest): Promise<FetchAnswerCommentsCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
