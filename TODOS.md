# TODOs

## Frontend: remove `categoryId` after backend cleanup

The `course_categories` junction table was removed from the backend. The following frontend files still reference `categoryId` and need cleanup:

- `src/features/courses/store/use-course-form-store.ts` — remove `categoryId`, `categoryName` state, `syncFormValues` params
- `src/features/courses/components/basic-info-section.tsx` — remove category selector dropdown
- `src/features/courses/components/publish-actions.tsx` — remove `categoryId` from publish body
- `src/features/courses/components/publish-section.tsx` — remove `categoryId` validation requirement
- `src/features/courses/components/publish-preview.tsx` — remove category display
- `src/features/courses/components/publish-checklist.tsx` — remove `categoryId` from checklist
