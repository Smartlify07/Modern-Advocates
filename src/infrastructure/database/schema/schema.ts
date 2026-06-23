import { user, session, account, verification, userRelations, sessionRelations, accountRelations } from "./auth"
import {
  categories,
  courses,
  courseModules,
  courseTopics,
  reviews,
  enrollments,
  courseCategories,
  topicCompletions,
} from "./course"
import {
  courseVideos,
  videoProgress,
  courseVideosRelations,
  videoProgressRelations,
} from "./video"

export const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
  categories,
  courses,
  courseModules,
  courseTopics,
  reviews,
  enrollments,
  courseCategories,
  topicCompletions,
  courseVideos,
  videoProgress,
  courseVideosRelations,
  videoProgressRelations,
}
