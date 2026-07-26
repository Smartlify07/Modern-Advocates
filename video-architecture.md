# Course Platform Video System Specification

## Overview

Build a scalable video upload, storage, and delivery system for a course platform.

### Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL (Neon)
- Drizzle ORM
- Better Auth
- Sentry
- Backblaze B2 (S3-compatible Object Storage)
- React
- Vidstack (Video Player)

---

# Goals

The system must:

1. Allow instructors/admins to upload course videos.
2. Upload directly from browser → Backblaze B2 via presigned URL.
3. Avoid routing video files through Next.js servers.
4. Store metadata in PostgreSQL.
5. Deliver videos through Backblaze B2 CDN.
6. Support raw MP4 delivery (HLS streaming possible as future enhancement).
7. Support future scaling to thousands of videos and users.
8. Support protected video playback for paid courses.
9. Support video progress tracking.

---

# Architecture

```text
Instructor Uploads Video
        |
        v
Frontend Requests Upload URL
        |
        v
Backend Generates Presigned Upload URL
        |
        v
Browser Uploads Directly To Backblaze B2 (PUT)
        |
        v
Upload Completes
        |
        v
Backend Updates Database (status = ready)
        |
        v
Video Becomes Available
        |
        v
Student Streams Through Backblaze B2 CDN
```

---

# Database Schema

## Table: course_videos

Stores video metadata.

```ts
id: uuid (primary key)

courseId: uuid
moduleId: uuid
topicId: uuid

title: text
description: text

storageKey: text           // B2 object key (e.g. course-videos/{courseId}/{moduleId}/{topicId}/{videoId}.mp4)

playbackUrl: text          // Public B2 URL for playback
thumbnailUrl: text         // Thumbnail URL (optional, can be generated server-side)

duration: integer

status:
  - uploading
  - ready
  - failed

createdAt: timestamp
updatedAt: timestamp
```

---

## Table: video_progress

Tracks user watch progress.

```ts
id: uuid

userId: uuid
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
(video_id)
```

---

# Storage Configuration

Backblaze B2 bucket structure:

```text
course-videos/{courseId}/{moduleId}/{topicId}/{videoId}.mp4
course-thumbnails/{uuid}.{ext}
```

B2 is configured via environment variables:

```text
B2_ENDPOINT=https://s3.us-west-001.backblazeb2.com
B2_REGION=us-west-001
B2_ACCESS_KEY_ID=
B2_SECRET_ACCESS_KEY=
B2_BUCKET_NAME=modern-advocates
NEXT_PUBLIC_B2_DOMAIN=https://f005.backblazeb2.com
```

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
  "uploadUrl": "https://s3.us-west-001.backblazeb2.com/...?X-Amz-Signature=...",
  "publicUrl": "https://f005.backblazeb2.com/file/modern-advocates/course-videos/...",
  "videoId": "uuid",
  "storageKey": "course-videos/uuid/uuid/uuid/uuid.mp4"
}
```

---

## Step 2

Frontend uploads directly to Backblaze B2 via presigned PUT URL.

```http
PUT {uploadUrl}
Content-Type: video/mp4
<binary video data>
```

Video file must never pass through Next.js.

Only browser → Backblaze B2.

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
topicId
title
```

No playback URL yet.

---

## Step 4

Upload completes.

The client signals success. The backend marks the video as ready.

Status:

```text
ready
```

No webhook needed — Backblaze B2 is raw object storage without transcoding.

---

## Step 5

Backend updates database.

Set:

```ts
storageKey
playbackUrl
status = "ready"
```

---

# Backend API Requirements

## Initiate Upload

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
- Generate presigned upload URL for B2
- Return upload URL, public URL, and video ID

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
2. Delete B2 object
3. Delete database record

Deletion must be transactional where possible.

---

# Frontend Requirements

## Upload Component

Component:

```text
VideoUploader
```

Responsibilities:

- Select file
- Request upload URL
- Upload to B2 via presigned PUT URL
- Show progress
- Handle failures

States:

```text
idle
uploading
uploaded
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

- Thumbnail (optional)
- Title
- Duration
- Upload status

Statuses:

```text
Uploading
Ready
Failed
```

---

## Video Player

Use Vidstack.

Requirements:

### Playback

Serve raw MP4 from B2 public URL.

Example source:

```text
https://f005.backblazeb2.com/file/modern-advocates/course-videos/uuid/uuid/uuid/uuid.mp4
```

HLS streaming can be added later via a transcoding service (Mux, Cloudflare Stream, etc.) if needed.

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

- Stream purchased course videos (if enrolled)
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
Signed B2 URLs (expiring presigned download URLs)
```

Implement architecture so signed URLs can be added later.

---

# Error Monitoring

Use Sentry.

Capture:

- Upload failures
- Progress update failures
- Storage API failures
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

Uses presigned PUT URLs (supports up to 5GB per file). For larger files, multipart upload can be added.

---

## Streaming

Use:

```text
Direct B2 CDN delivery
Raw MP4
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
→ Backblaze B2 CDN

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

  infrastructure/
    storage/
      config.ts
      service.ts

  infrastructure/database/schema/
    video.ts
    videoProgress.ts

  features/videos/
    components/
      VideoUploader.tsx
      VideoPlayer.tsx
      CourseVideoList.tsx

  shared/lib/
    storage-upload.ts
```

---

# Success Criteria

A completed implementation must:

- Upload directly to Backblaze B2 via presigned URL
- Avoid server-side file uploads
- Store metadata in PostgreSQL
- Stream via B2 public URLs
- Track progress efficiently
- Support protected access
- Scale independently from application servers
- Report failures through Sentry
- Be production ready

```
