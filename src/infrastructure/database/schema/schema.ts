import { user, session, account, verification, userRelations, sessionRelations, accountRelations } from "./auth"
import {
  categories,
  courses,
  courseModules,
  courseTopics,
  reviews,
  orders,
  enrollments,
  topicCompletions,
} from "./course"
import {
  courseVideos,
  videoProgress,
  courseVideosRelations,
  videoProgressRelations,
} from "./video"
import { donations, donationType } from "./donation"

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
  orders,
  enrollments,
  topicCompletions,
  courseVideos,
  videoProgress,
  courseVideosRelations,
  videoProgressRelations,
  donations,
  donationType,
}
