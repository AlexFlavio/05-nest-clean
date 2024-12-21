import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question"
import { FetchRecentQuestionsCase } from "@/domain/forum/application/use-cases/fetch-recent-questions"
import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { AuthenticateController } from "./controllers/authenticate.controller"
import { CreateAccountController } from "./controllers/create-account.controller"
import { CreateQuestionController } from "./controllers/create-question.controller"
import { FetchRecentQuestionsController } from "./controllers/fetch-recents-questions.controller"

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    AuthenticateController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsCase],
})
export class HttpModule {}
