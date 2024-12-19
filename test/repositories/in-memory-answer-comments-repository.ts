import { PaginationParams } from "@/core/repositories/pagination-params"
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository"
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment"

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answercomment = this.items.find((item) => item.id.toString() === id)

    if (!answercomment) {
      return null
    }

    return answercomment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      // .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answercomment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answercomment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
