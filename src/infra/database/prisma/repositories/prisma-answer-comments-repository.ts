import { PaginationParams } from "@/core/repositories/pagination-params"
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository"
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaAnswerMapper } from "./mappers/prisma-answer-mapper"

@Injectable({})
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.")
  }

  create(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.")
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
