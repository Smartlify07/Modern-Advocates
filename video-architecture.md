# Course Platform Video System Specification

## Overview

Build a scalable video upload, processing, and delivery system for a course platform.

### Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL (Neon)
- Drizzle ORM
- Better Auth
- Sentry
- Cloudinary (Video Storage + Streaming)
- React
- Vidstack (Video Player)

---

# Goals

The system must:

1. Allow instructors/admins to upload course videos.
2. Upload directly from browser → Cloudinary.
3. Avoid routing video files through Next.js servers.
4. Process videos asynchronously.
5. Store metadata in PostgreSQL.
6. Deliver videos through Cloudinary CDN.
7. Support HLS streaming.
8. Support future scaling to thousands of videos and users.
9. Support protected video playback for paid courses.
10. Support video progress tracking.

---

# Architecture

```text
Instructor Uploads Video
        |
        v
Frontend Requests Upload Signature
        |
        v
Backend Generates Cloudinary Signature
        |
        v
Browser Uploads Directly To Cloudinary
        |
        v
Cloudinary Processes Video
        |
        v
Cloudinary Webhook
        |
        v
Backend Updates Database
        |
        v
Video Becomes Available
        |
        v
Student Streams Through Cloudinary CDN
```

---

# Database Schema

## Table: course_videos

Stores video metadata.

```ts
id: uuid (primary key)

courseId: uuid
moduleId: uuid

title: text
description: text

cloudinaryPublicId: text

playbackUrl: text
thumbnailUrl: text

duration: integer

status:
  - uploading
  - processing
  - ready
  - failed

createdAt: timestamp
updatedAt: timestamp
```

---

## Table: course_modules

```ts
id: uuid
courseId: uuid

title: text
description: text

position: integer

createdAt: timestamp
updatedAt: timestamp
```

---

## Table: video_progress

Tracks user watch progress.

```ts
id: uuid

userId: uuid

courseId: uuid
moduleId: uuid
videoId: uuid

watchedSeconds: integer

completed: boolean

lastWatchedAt: timestamp

createdAt: timestamp
updatedAt: timestamp
```

Indexes:

```sql
(user_id, video_id)
(course_id)
(video_id)
```

---

# Cloudinary Configuration

Create folder structure:

```text
course-videos/
```

Example:

```text
course-videos/course-123/module-456/video.mp4
```

Enable:

- Video uploads
- Adaptive bitrate streaming
- HLS generation
- Video thumbnails
- Signed uploads
- Webhooks

---

# Upload Flow

## Step 1

Instructor clicks upload.

Frontend requests upload credentials.

Endpoint:

```http
POST /api/videos/sign-upload
```

Response:

```json
{
  "timestamp": 1234567890,
  "signature": "...",
  "apiKey": "...",
  "cloudName": "..."
}
```

---

## Step 2

Frontend uploads directly to Cloudinary.

Use:

```http
https://api.cloudinary.com/v1_1/{cloud_name}/video/upload
```

Video file must never pass through Next.js.

Only browser → Cloudinary.

---

## Step 3

Store temporary database record.

Status:

```text
uploading
```

Store:

```ts
courseId
moduleId
title
```

No playback URL yet.

---

## Step 4

Cloudinary finishes upload.

Cloudinary sends webhook.

Endpoint:

```http
POST /api/webhooks/cloudinary
```

Verify webhook signature.

Never trust unsigned webhook requests.

---

## Step 5

Webhook updates database.

Extract:

```ts
public_id
duration
secure_url
```

Generate:

```ts
playbackUrl
thumbnailUrl
```

Update status:

```text
ready
```

If processing fails:

```text
failed
```

---

# Backend API Requirements

## Create Upload Signature

Route:

```http
POST /api/videos/sign-upload
```

Authorization required.

Roles allowed:

```text
admin
instructor
```

Responsibilities:

- Verify user session
- Generate Cloudinary signature
- Return upload metadata

---

## Get Video

Route:

```http
GET /api/videos/:videoId
```

Responsibilities:

- Verify access
- Return metadata
- Return playback URL

Response:

```json
{
  "id": "...",
  "title": "...",
  "duration": 1200,
  "thumbnailUrl": "...",
  "playbackUrl": "..."
}
```

---

## Update Progress

Route:

```http
POST /api/videos/:videoId/progress
```

Payload:

```json
{
  "watchedSeconds": 320
}
```

Behavior:

- Upsert progress record
- Mark completed when threshold reached

Threshold:

```text
>= 90% watched
```

---

## Delete Video

Route:

```http
DELETE /api/videos/:videoId
```

Responsibilities:

1. Verify permissions
2. Delete Cloudinary asset
3. Delete database record

Deletion must be transactional where possible.

---

# Cloudinary Webhook Handler

Route:

```http
POST /api/webhooks/cloudinary
```

Requirements:

### Verify Signature

Reject invalid requests.

### Process Events

Handle:

```text
upload.completed
video.ready
video.failed
```

Update database accordingly.

### Error Handling

Log failures to Sentry.

Never crash endpoint.

Always return proper status code.

---

# Frontend Requirements

## Upload Component

Component:

```text
VideoUploader
```

Responsibilities:

- Select file
- Request upload signature
- Upload to Cloudinary
- Show progress
- Handle failures

States:

```text
idle
uploading
processing
success
error
```

---

## Upload Progress

Show:

```text
0% → 100%
```

Use actual upload progress events.

Do not fake progress.

---

## Video Library

Component:

```text
CourseVideoList
```

Displays:

- Thumbnail
- Title
- Duration
- Upload status

Statuses:

```text
Uploading
Processing
Ready
Failed
```

---

## Video Player

Use Vidstack.

Requirements:

### Streaming

Prefer HLS.

Example source:

```text
https://res.cloudinary.com/.../video/upload/sp_hd/.../playlist.m3u8
```

Do not stream raw MP4 unless fallback required.

---

### Tracking Progress

Every 15 seconds:

```ts
POST /api/videos/:videoId/progress
```

Send:

```json
{
  "watchedSeconds": currentTime
}
```

Avoid sending every second.

---

### Resume Playback

When user returns:

1. Load saved progress.
2. Seek player.
3. Resume from last position.

---

# Access Control

## Instructor Access

Can:

- Upload videos
- Delete videos
- Edit metadata

---

## Student Access

Can:

- Stream purchased course videos
- Save progress

Cannot:

- Upload
- Delete

---

# Protected Playback

Videos should not be fully public.

Backend must verify:

```text
User owns course
OR
User enrolled
OR
User is admin
```

Only then return playback URL.

Future enhancement:

```text
Cloudinary Signed URLs
```

Implement architecture so signed URLs can be added later.

---

# Error Monitoring

Use Sentry.

Capture:

- Upload failures
- Webhook failures
- Progress update failures
- Cloudinary API failures
- Authorization failures

Attach:

```ts
userId
courseId
videoId
```

where available.

---

# Performance Requirements

## Uploads

Must support:

```text
100MB+
500MB+
1GB+
```

Use chunked uploads when supported.

---

## Streaming

Use:

```text
HLS
Adaptive Bitrate
Cloudinary CDN
```

Do not proxy videos through Next.js.

---

## Database

Store only metadata.

Never store:

```text
video binaries
video chunks
raw files
```

inside PostgreSQL.

---

# Scalability Requirements

System should support:

```text
10,000+ videos
100,000+ users
Millions of video views
```

without backend video bottlenecks.

Reason:

All video traffic must flow:

User
→ Cloudinary CDN

NOT:

User
→ Next.js
→ Video

---

# Folder Structure

```text
src/

  app/
    api/
      videos/
        sign-upload/
        [videoId]/
          route.ts
          progress/
      webhooks/
        cloudinary/

  lib/
    cloudinary/
      client.ts
      signatures.ts
      webhooks.ts

  db/
    schema/
      courseVideos.ts
      videoProgress.ts

  components/
    video/
      VideoUploader.tsx
      VideoPlayer.tsx
      CourseVideoList.tsx

  services/
    videos/
      createVideo.ts
      deleteVideo.ts
      updateProgress.ts
```

---

# Success Criteria

A completed implementation must:

- Upload directly to Cloudinary
- Avoid server-side file uploads
- Store metadata in PostgreSQL
- Process webhooks correctly
- Stream via HLS
- Track progress efficiently
- Support protected access
- Scale independently from application servers
- Report failures through Sentry
- Be production ready

```

```
