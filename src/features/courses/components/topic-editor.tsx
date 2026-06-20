"use client"

import { useCallback, useEffect, useRef } from "react"
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"

import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
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
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  TextQuoteIcon,
  CodeIcon,
  LinkIcon,
  ImageIcon,
  Trash2Icon,
  XIcon,
  UploadIcon,
} from "lucide-react"

import type { Topic, TopicType } from "@/features/courses/types"

interface TopicEditorProps {
  topic: Topic
  onChange: (topic: Topic) => void
  onDelete: () => void
}

const typeLabels: Record<TopicType, string> = {
  video: "Video only",
  text: "Text only",
  video_and_text: "Video and text",
}

function TiptapEditor({
  content,
  onChange,
}: {
  content: JSONContent | null
  onChange: (json: JSONContent) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-32 px-3 py-2 text-sm leading-relaxed [&_p]:my-1 [&_h1]:text-lg [&_h1]:font-heading [&_h1]:font-medium [&_h2]:text-base [&_h2]:font-heading [&_h2]:font-medium [&_h3]:text-sm [&_h3]:font-medium [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_li]:my-0.5 [&_blockquote]:border-s-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-xs [&_img]:rounded-lg [&_img]:border [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
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

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Image URL")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-0.5 border-b bg-muted/30 px-1 py-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <BoldIcon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <ItalicIcon className="size-3.5" />
        </Button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          data-active={editor.isActive("heading", { level: 1 })}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <Heading1Icon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          data-active={editor.isActive("heading", { level: 2 })}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <Heading2Icon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          data-active={editor.isActive("heading", { level: 3 })}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <Heading3Icon className="size-3.5" />
        </Button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote")}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <TextQuoteIcon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-active={editor.isActive("codeBlock")}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <CodeIcon className="size-3.5" />
        </Button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={setLink}
          data-active={editor.isActive("link")}
          className="data-active:bg-muted data-active:text-foreground"
        >
          <LinkIcon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={addImage}>
          <ImageIcon className="size-3.5" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export function TopicEditor({ topic, onChange, onDelete }: TopicEditorProps) {
  const showVideo = topic.type === "video" || topic.type === "video_and_text"
  const showDescription =
    topic.type === "text" || topic.type === "video_and_text"

  const update = (partial: Partial<Topic>) => {
    onChange({ ...topic, ...partial })
  }

  const handleDescriptionChange = useCallback(
    (json: JSONContent) => {
      update({ description: json })
    },
    [topic]
  )

  return (
    <Card className="overflow-hidden ring-0">
      <div className="flex items-stretch">
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={topic.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Topic title"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={topic.type}
              onValueChange={(val) =>
                update({
                  type: val as TopicType,
                  videoUrl: val === "text" ? null : topic.videoUrl,
                  description: val === "video" ? null : topic.description,
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["video", "text", "video_and_text"] as TopicType[]).map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {typeLabels[t]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {showVideo && (
            <div>
              {topic.videoUrl ? (
                <div className="relative overflow-hidden rounded-lg border bg-muted/30">
                  <div className="flex aspect-video items-center justify-center bg-black/5">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <span className="text-xs font-medium">Video URL</span>
                      <span className="max-w-full truncate px-4 text-xs">
                        {topic.videoUrl}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1 right-1"
                    onClick={() => update({ videoUrl: null })}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = window.prompt("Paste a video URL")
                        if (url) update({ videoUrl: url })
                      }}
                    >
                      <UploadIcon className="size-3.5" />
                      Upload
                    </Button>
                    <span className="text-xs text-muted-foreground">or</span>
                    <Input
                      placeholder="Paste a video URL"
                      className="h-7 flex-1 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const url = (e.target as HTMLInputElement).value
                          if (url) update({ videoUrl: url })
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {showDescription && (
            <TiptapEditor
              content={topic.description}
              onChange={handleDescriptionChange}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="my-2 flex w-11 shrink-0 items-center justify-center rounded-sm text-destructive transition-colors hover:bg-destructive hover:[&>svg]:text-white"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </Card>
  )
}
