import { randomUUID } from "node:crypto"
import { sql } from "drizzle-orm"
import { db } from "./client"
import { user, account } from "./schema/auth"
import { generatePresignedDownloadUrl } from "../storage/service"
import {
  categories,
  courses,
  courseModules,
  courseTopics,
  reviews,
} from "./schema/course"
import { donations } from "./schema/donation"

const MODULE_TITLES: Record<string, string[]> = {
  "Build Foundational AI Skills": [
    "Introduction to Artificial Intelligence",
    "Machine Learning Fundamentals",
    "Neural Networks & Deep Learning",
    "Natural Language Processing",
    "Computer Vision Basics",
    "AI Ethics & Responsible Development",
    "Data Preparation & Management",
    "Model Training & Evaluation",
    "AI Deployment Strategies",
    "AI in Business Applications",
    "Prompt Engineering",
    "Future of AI & Emerging Trends",
  ],
  "Income Producing Assets": [
    "Introduction to Asset Building",
    "Real Estate Investment Fundamentals",
    "Stock Market & Equity Investments",
    "Digital Assets & Cryptocurrency",
    "Building a Diversified Portfolio",
    "Rental Income Strategies",
    "Dividend Income Planning",
    "Intellectual Property as Assets",
    "Business Ownership & Scaling",
    "Asset Protection & Risk Management",
    "Tax Optimization for Asset Growth",
    "Long-term Wealth Building Plan",
  ],
  "Generate first revenue within 60 days": [
    "Mindset & Goal Setting for Quick Revenue",
    "Identifying Your First Revenue Stream",
    "Building a Minimum Viable Product",
    "Pricing Strategies for Rapid Sales",
    "Customer Acquisition on a Budget",
    "Sales Funnel Fundamentals",
    "Leveraging Social Media for Sales",
    "Email Marketing & List Building",
    "Partnerships & Affiliate Revenue",
    "Scaling Customer Success",
    "Automating Revenue Processes",
    "60-Day Revenue Review & Optimization",
  ],
}

const TOPIC_TITLES = [
  "Introduction & Overview",
  "Key Concepts & Principles",
  "Practical Application",
  "Case Study & Real-World Examples",
  "Summary & Next Steps",
]

const SEED_THUMBNAIL_KEYS = [
  "seed-thumbnails/course-1.png",
  "seed-thumbnails/course-2.png",
  "seed-thumbnails/course-3.png",
]

const COURSE_DATA = [
  {
    title: "Build Foundational AI Skills",
    thumbnailKey: SEED_THUMBNAIL_KEYS[0],
    content:
      "Master the fundamentals of artificial intelligence from the ground up. This course covers machine learning, neural networks, NLP, computer vision, and AI ethics — everything you need to start building intelligent solutions.",
    overview:
      "A comprehensive introduction to AI concepts, tools, and real-world applications for beginners and aspiring practitioners.",
  },
  {
    title: "Income Producing Assets",
    thumbnailKey: SEED_THUMBNAIL_KEYS[1],
    content:
      "Learn how to build, manage, and scale income-producing assets across real estate, digital assets, stocks, and business ownership. Develop a diversified portfolio that generates passive income.",
    overview:
      "Build lasting wealth by mastering the strategies behind income-generating assets and portfolio diversification.",
  },
  {
    title: "Generate first revenue within 60 days",
    thumbnailKey: SEED_THUMBNAIL_KEYS[2],
    content:
      "A high-intensity, action-oriented course designed to help you launch a revenue-generating product or service in just 60 days. Covers MVP development, pricing, customer acquisition, and sales automation.",
    overview:
      "Go from idea to first sale in 60 days with proven strategies for rapid revenue generation and scalable growth.",
  },
]

async function reset() {
  console.log("Clearing existing data...")
  await db.execute(sql`
    TRUNCATE TABLE
      "user",
      session,
      account,
      verification,
      categories,
      courses,
      course_modules,
      course_topics,
      reviews,
      enrollments,
      topic_completions,
      donations
    CASCADE
  `)
  console.log("Database cleared")
}

async function seed() {
  await reset()

  const adminId = randomUUID()
  const tutorId = randomUUID()
  const student1Id = randomUUID()
  const student2Id = randomUUID()
  const student3Id = randomUUID()

  const catAIFundamentalsId = randomUUID()
  const catAssetBuildingId = randomUUID()
  const catRevenueGenerationId = randomUUID()

  await db.insert(user).values([
    {
      id: adminId,
      name: "Admin User",
      email: "testmodadvincadmin@gmail.com",
      emailVerified: true,
      role: "admin",
    },
    {
      id: tutorId,
      name: "Maxwell Anthony",
      email: "maxwell.anthony@modernadvocates.com",
      emailVerified: true,
    },
    {
      id: student1Id,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      emailVerified: true,
    },
    {
      id: student2Id,
      name: "James Thompson",
      email: "james.thompson@example.com",
      emailVerified: true,
    },
    {
      id: student3Id,
      name: "Sophia Williams",
      email: "sophia.williams@example.com",
      emailVerified: true,
    },
  ])

  await db.insert(account).values([
    {
      id: randomUUID(),
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
    },
    {
      id: randomUUID(),
      accountId: tutorId,
      providerId: "credential",
      userId: tutorId,
    },
    {
      id: randomUUID(),
      accountId: student1Id,
      providerId: "credential",
      userId: student1Id,
    },
    {
      id: randomUUID(),
      accountId: student2Id,
      providerId: "credential",
      userId: student2Id,
    },
    {
      id: randomUUID(),
      accountId: student3Id,
      providerId: "credential",
      userId: student3Id,
    },
  ])

  await db.insert(categories).values([
    {
      id: catAIFundamentalsId,
      name: "AI Fundamentals",
      slug: "ai-fundamentals",
      description: "Foundational artificial intelligence and machine learning courses",
    },
    {
      id: catAssetBuildingId,
      name: "Asset Building",
      slug: "asset-building",
      description: "Courses on building and managing income-producing assets",
    },
    {
      id: catRevenueGenerationId,
      name: "Revenue Generation",
      slug: "revenue-generation",
      description: "Practical courses on generating revenue quickly",
    },
  ])

  for (let c = 0; c < COURSE_DATA.length; c++) {
    const courseId = randomUUID()
    const data = COURSE_DATA[c]

    const thumbnailUrl = await generatePresignedDownloadUrl(data.thumbnailKey, 604800)

    await db.insert(courses).values([
      {
        id: courseId,
        title: data.title,
        content: data.content,
        overview: data.overview,
        thumbnailUrl,
        language: "en",
        level: "beginner" as const,
        price: 550.00,
        discountedPrice: 100.00,
        duration: 720,
        status: "published" as const,
        tutorId,
      },
    ])

    const titles = MODULE_TITLES[data.title]
    for (let m = 0; m < 12; m++) {
      const moduleId = randomUUID()
      await db.insert(courseModules).values([
        {
          id: moduleId,
          courseId,
          title: titles[m],
          sortOrder: m,
        },
      ])

      for (let t = 0; t < 5; t++) {
        const topicId = randomUUID()

        await db.insert(courseTopics).values([
          {
            id: topicId,
            moduleId,
            title: `${titles[m]} - ${TOPIC_TITLES[t]}`,
            format: "text",
            content: `Comprehensive study material covering ${TOPIC_TITLES[t].toLowerCase()} for "${titles[m]}". This module explores essential concepts, practical techniques, and real-world applications to help you build mastery in this area.`,
            estimatedDuration: 15,
            sortOrder: t,
          },
        ])
      }
    }

    const students = [student1Id, student2Id, student3Id]
    for (const studentId of students) {
      await db.insert(reviews).values([
        {
          courseId,
          studentId,
          rating: 5,
          body: `An outstanding course! The content was well-structured, practical, and easy to follow. I highly recommend it to anyone looking to deepen their understanding of ${data.title.toLowerCase()}.`,
        },
      ])
    }
  }

  await db.insert(donations).values([
    { id: randomUUID(), donorName: "Alice Johnson", donorEmail: "alice@example.com", amount: 800, donationType: "fixed" },
    { id: randomUUID(), donorName: "Bob Smith", donorEmail: "bob@example.com", amount: 1300, donationType: "monthly" },
    { id: randomUUID(), donorName: "Carol White", donorEmail: "carol@example.com", amount: 500, donationType: "tier" },
    { id: randomUUID(), donorName: "David Brown", donorEmail: "david@example.com", amount: 200, donationType: "fixed" },
    { id: randomUUID(), donorName: "Eve Davis", donorEmail: "eve@example.com", amount: 2500, donationType: "monthly" },
  ])

  console.log(
    `Seed complete — 5 users, 3 categories, 3 courses, 36 modules, 180 topics, 9 reviews, 5 donations`
  )
}

seed().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
