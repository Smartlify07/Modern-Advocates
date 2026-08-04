export const queryKeys = {
  course: {
    all: ["course"] as const,
    detail: (courseId: string) => [...queryKeys.course.all, courseId] as const,
  },
  courseSummary: (courseId: string | null) => ["course-summary", courseId] as const,
  topicVideo: (videoId: string | null) => ["topic-video", videoId] as const,
  enrollment: {
    progress: (courseId: string) => ["enrollment-progress", courseId] as const,
    check: (courseId: string) => ["enrollment-check", courseId] as const,
  },
  featuredCourses: ["featured-courses"] as const,
  publicCourses: ["public-courses"] as const,
  myLearning: ["my-learning"] as const,
  userCourses: ["user-courses"] as const,
  userEnrollments: ["user-enrollments"] as const,
  donationSuccess: (sessionId: string | null) => ["donation-success", sessionId] as const,
  inviteValidate: (token: string | null) => ["invite-validate", token] as const,
  admin: {
    dashboardStats: ["admin-dashboard-stats"] as const,
    users: {
      all: ["admin-users"] as const,
      list: (filters: {
        search?: string
        status?: string
        page?: number
        pageSize?: number
      }) => [...queryKeys.admin.users.all, filters] as const,
    },
    team: {
      all: ["admin-team"] as const,
      list: (search: string, typeFilter: string, page: number) =>
        ["admin-team", search, typeFilter, page] as const,
    },
    support: {
      all: ["admin-support"] as const,
      list: (params: {
        search?: string
        filter?: string
        page?: number
        pageSize?: number
      }) => [...queryKeys.admin.support.all, params] as const,
    },
    courses: ["admin-courses"] as const,
    products: ["admin-products"] as const,
    customers: ["admin-customers"] as const,
    sales: ["admin-sales"] as const,
    saleDetail: (productId: string) => ["admin-sale-detail", productId] as const,
    salesStats: (period: string) => ["admin-sales-stats", period] as const,
    transactions: ["admin-transactions"] as const,
    donations: ["admin-donations"] as const,
  },
}
