import { PaginationParams } from "@/core/repositories/pagination-params"
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository"
import { Question } from "@/domain/forum/enterprise/entities/question"
import { Injectable } from "@nestjs/common"
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper"
import { PrismaService } from "../prisma.service"

@Injectable({})
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string) {
    throw new Error("Method not implemented.")
  }

  async findManyRecent(params: PaginationParams) {
    throw new Error("Method not implemented.")
  }

  async save(question: Question) {
    throw new Error("Method not implemented.")
  }

  async create(question: Question) {
    throw new Error("Method not implemented.")
  }

  async delete(question: Question) {
    throw new Error("Method not implemented.")
  }
}
