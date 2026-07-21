"use client"

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Link from "@tiptap/extension-link"
import { useEffect, useCallback } from "react"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  LinkIcon,
} from "lucide-react"

function OverviewEditor({
  content,
  onChange,
}: {
  content: JSONContent | null
  onChange: (json: JSONContent) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Link.configure({ openOnClick: false }),
    ],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-32 px-3 py-2 text-sm leading-relaxed [&_p]:my-1 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_a]:text-primary [&_a]:underline",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  useEffect(() => {
    return () => editor?.destroy()
  }, [editor])

  useEffect(() => {
    if (editor && content) {
      const currentJson = editor.getJSON()
      if (JSON.stringify(currentJson) !== JSON.stringify(content)) {
        editor.commands.setContent(content)
      }
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Link URL", previousUrl ?? "")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border bg-slate-50">
        <p className="text-sm text-slate-400">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <EditorContent editor={editor} />
      <div className="flex items-center gap-0.5 border-t bg-slate-50 px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        >
          <BoldIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          <ItalicIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Underline"
        >
          <span className="text-xs font-bold underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label="Strikethrough"
        >
          <StrikethroughIcon className="size-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={setLink}
          label="Link"
        >
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullet List"
        >
          <ListIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Numbered List"
        >
          <ListOrderedIcon className="size-3.5" />
        </ToolbarButton>
      </div>
    </div>
  )
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700 ${active ? "bg-slate-200 text-slate-700" : ""}`}
    >
      {children}
    </button>
  )
}

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Portuguese",
]
const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]
const durationUnits = ["Hours", "Days", "Weeks"]

export function AdvanceInfoStep() {
  const overview = useCourseWizardStore((s) => s.overview)
  const setOverview = useCourseWizardStore((s) => s.setOverview)
  const language = useCourseWizardStore((s) => s.language)
  const setLanguage = useCourseWizardStore((s) => s.setLanguage)
  const level = useCourseWizardStore((s) => s.level)
  const setLevel = useCourseWizardStore((s) => s.setLevel)
  const duration = useCourseWizardStore((s) => s.duration)
  const setDuration = useCourseWizardStore((s) => s.setDuration)
  const durationUnit = useCourseWizardStore((s) => s.durationUnit)
  const setDurationUnit = useCourseWizardStore((s) => s.setDurationUnit)
  const instructorName = useCourseWizardStore((s) => s.instructorName)
  const setInstructorName = useCourseWizardStore((s) => s.setInstructorName)
  const instructorSpecialty = useCourseWizardStore((s) => s.instructorSpecialty)
  const setInstructorSpecialty = useCourseWizardStore(
    (s) => s.setInstructorSpecialty
  )
  const aboutInstructor = useCourseWizardStore((s) => s.aboutInstructor)
  const setAboutInstructor = useCourseWizardStore((s) => s.setAboutInstructor)

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-normal">
          Course Overview
        </label>
        <OverviewEditor content={overview} onChange={setOverview} />
      </div>

      <div className="border-t border-slate-200" />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-normal">
            Course Language
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full rounded-[8px] data-[size=default]:h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="flex flex-col gap-1 p-2">
              {languages.map((l) => (
                <SelectItem
                  key={l}
                  value={l}
                  className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
                >
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-normal">Course Level</label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-full rounded-[8px] data-[size=default]:h-[44px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="space-y-1 p-2">
              {levels.map((l) => (
                <SelectItem
                  key={l.value}
                  value={l.value}
                  className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
                >
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-normal">Duration*</label>
          <div className="flex gap-3">
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration"
              type="number"
              min="0"
              className="flex-1[appearance:textfield] h-[44px] rounded-[8px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Select value={durationUnit} onValueChange={setDurationUnit}>
              <SelectTrigger className="w-1/2 rounded-[8px] data-[size=default]:h-[44px]">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="space-y-1 p-2">
                {durationUnits.map((u) => (
                  <SelectItem
                    key={u}
                    value={u}
                    className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
                  >
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-normal">
              Instructor Name
            </label>
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="Instructor name"
              maxLength={120}
              className="h-[44px] rounded-[8px]"
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {instructorName.length}/120
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-normal">
              Instructor Specialty
            </label>
            <Input
              value={instructorSpecialty}
              onChange={(e) => setInstructorSpecialty(e.target.value)}
              placeholder="Software Engineer"
              maxLength={120}
              className="h-[44px] rounded-[8px]"
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {instructorSpecialty.length}/120
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-normal">
            About Instructor
          </label>
          <textarea
            value={aboutInstructor}
            onChange={(e) => setAboutInstructor(e.target.value)}
            placeholder="With 10+ years of experience in ML engineering and applied AI..."
            className="h-28 w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
          />
        </div>
      </div>
    </div>
  )
}
