import { randomUUID } from "node:crypto"
import { db } from "./client"
import {
  users,
  profiles,
  categories,
  courses,
  courseModules,
  courseTopics,
  reviews,
  enrollments,
  courseCategories,
  topicCompletions,
} from "./schema"

async function seed() {
  // ── IDs ─────────────────────────────────────────────────────────────────
  const adminUserId = randomUUID()
  const tutorUserId = randomUUID()
  const studentUserId = randomUUID()

  const adminProfileId = randomUUID()
  const tutorProfileId = randomUUID()
  const studentProfileId = randomUUID()

  const catBusinessId = randomUUID()
  const catTechId = randomUUID()
  const catDesignId = randomUUID()

  const course1Id = randomUUID()
  const course2Id = randomUUID()

  const module1Id = randomUUID()
  const module2Id = randomUUID()
  const module3Id = randomUUID()

  const topic1Id = randomUUID()
  const topic2Id = randomUUID()
  const topic3Id = randomUUID()
  const topic4Id = randomUUID()
  const topic5Id = randomUUID()
  const topic6Id = randomUUID()

  const enrollment1Id = randomUUID()
  const enrollment2Id = randomUUID()

  const completion1Id = randomUUID()
  const completion2Id = randomUUID()

  // ── Users ───────────────────────────────────────────────────────────────
  await db.insert(users).values([
    { id: adminUserId, email: "admin@modernadvocates.com" },
    { id: tutorUserId, email: "sarah.chen@modernadvocates.com" },
    { id: studentUserId, email: "jake.student@example.com" },
  ])

  // ── Profiles ────────────────────────────────────────────────────────────
  await db.insert(profiles).values([
    {
      id: adminProfileId,
      userId: adminUserId,
      type: "admin",
      firstName: "Alex",
      lastName: "Martinez",
    },
    {
      id: tutorProfileId,
      userId: tutorUserId,
      type: "tutor",
      firstName: "Sarah",
      lastName: "Chen",
      bio: "Senior legal consultant with 12 years of experience in corporate law and legaltech.",
    },
    {
      id: studentProfileId,
      userId: studentUserId,
      type: "student",
      firstName: "Jake",
      lastName: "Sullivan",
    },
  ])

  // ── Categories ──────────────────────────────────────────────────────────
  await db.insert(categories).values([
    { id: catBusinessId, name: "Business Law", slug: "business-law", description: "Corporate & commercial legal practice" },
    { id: catTechId, name: "Technology Law", slug: "technology-law", description: "Tech regulation, IP, and data privacy" },
    { id: catDesignId, name: "Legal Design", slug: "legal-design", description: "Legal document design and UX" },
  ])

  // ── Courses ─────────────────────────────────────────────────────────────
  await db.insert(courses).values([
    {
      id: course1Id,
      title: "Contract Drafting for Modern Practitioners",
      content: "A comprehensive deep-dive into modern contract drafting techniques. Covers plain-language clauses, automated templates, risk allocation strategies, and negotiation tactics for the digital age.",
      overview: "Master the art of contract drafting with plain-language techniques, automation strategies, and real-world case studies.",
      language: "en",
      level: "intermediate",
      price: 299.99,
      discountedPrice: 199.99,
      duration: 480,
      status: "published",
      tutorId: tutorProfileId,
    },
    {
      id: course2Id,
      title: "Data Privacy Compliance Fundamentals",
      content: "Navigate the evolving landscape of data privacy regulations including GDPR, CCPA, and emerging frameworks. This course provides practical compliance checklists, breach response protocols, and privacy-by-design methodologies.",
      overview: "Build a rock-solid foundation in data privacy regulations, compliance frameworks, and breach management.",
      language: "en",
      level: "beginner",
      price: 149.99,
      duration: 320,
      status: "published",
      tutorId: tutorProfileId,
    },
  ])

  // ── Course Modules ──────────────────────────────────────────────────────
  await db.insert(courseModules).values([
    { id: module1Id, courseId: course1Id, title: "Foundations of Modern Contract Drafting", sortOrder: 0 },
    { id: module2Id, courseId: course1Id, title: "Clause Design & Risk Allocation", sortOrder: 1 },
    { id: module3Id, courseId: course2Id, title: "Understanding Privacy Regulations", sortOrder: 0 },
  ])

  // ── Course Topics ───────────────────────────────────────────────────────
  await db.insert(courseTopics).values([
    { id: topic1Id, moduleId: module1Id, title: "Plain Language Principles", format: "video", content: "https://videos.example.com/plain-language", estimatedDuration: 45, sortOrder: 0 },
    { id: topic2Id, moduleId: module1Id, title: "Automation in Contract Drafting", format: "text", content: "Learn about template automation tools and when to use them.", estimatedDuration: 30, sortOrder: 1 },
    { id: topic3Id, moduleId: module2Id, title: "Indemnification Clauses", format: "video", content: "https://videos.example.com/indemnification", estimatedDuration: 60, sortOrder: 0 },
    { id: topic4Id, moduleId: module2Id, title: "Limitation of Liability Strategies", format: "text", content: "Explore different approaches to capping liability in commercial contracts.", estimatedDuration: 35, sortOrder: 1 },
    { id: topic5Id, moduleId: module3Id, title: "GDPR Overview", format: "video", content: "https://videos.example.com/gdpr-overview", estimatedDuration: 50, sortOrder: 0 },
    { id: topic6Id, moduleId: module3Id, title: "CCPA Compliance Checklist", format: "text", content: "Step-by-step guide to achieving CCPA compliance for your organization.", estimatedDuration: 40, sortOrder: 1 },
  ])

  // ── Reviews ─────────────────────────────────────────────────────────────
  await db.insert(reviews).values([
    { courseId: course1Id, studentId: studentProfileId, rating: 5, body: "Excellent course! Sarah breaks down complex drafting concepts into digestible lessons." },
    { courseId: course2Id, studentId: studentProfileId, rating: 4, body: "Great introduction to data privacy. Could use more depth on enforcement mechanics." },
  ])

  // ── Enrollments ─────────────────────────────────────────────────────────
  await db.insert(enrollments).values([
    { id: enrollment1Id, courseId: course1Id, studentId: studentProfileId, status: "active" },
    { id: enrollment2Id, courseId: course2Id, studentId: studentProfileId, status: "completed", completedAt: new Date("2026-05-28") },
  ])

  // ── Topic Completions ────────────────────────────────────────────────
  await db.insert(topicCompletions).values([
    { enrollmentId: enrollment1Id, topicId: topic1Id },
    { enrollmentId: enrollment1Id, topicId: topic2Id },
  ])

  // ── Course <-> Category ─────────────────────────────────────────────────
  await db.insert(courseCategories).values([
    { courseId: course1Id, categoryId: catBusinessId },
    { courseId: course2Id, categoryId: catTechId },
    { courseId: course2Id, categoryId: catBusinessId },
  ])

  console.log("✓ Seed complete — 3 users, 3 profiles, 3 categories, 2 courses, 3 modules, 6 topics, 2 reviews, 2 enrollments, 2 topic completions")
}

seed().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
