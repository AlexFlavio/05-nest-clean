import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/primas-question-attachments-repository"
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository"
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository"
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository"
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository"
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository"

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}