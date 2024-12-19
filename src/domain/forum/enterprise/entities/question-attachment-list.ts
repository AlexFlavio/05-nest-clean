import { WatchedList } from "@/core/entities/watched-list"
import { QuestionAttachment } from "./question-attachments"

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
