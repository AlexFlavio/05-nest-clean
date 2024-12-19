import { Either, right } from "@/core/either"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"

interface FetchQuestionCommentsCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionCommentsCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  constructor(private questioncommentsRepository: QuestionCommentsRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsCaseRequest): Promise<FetchQuestionCommentsCaseResponse> {
    const questionComments =
      await this.questioncommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({
      questionComments,
    })
  }
}
