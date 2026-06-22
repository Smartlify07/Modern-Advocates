"use client"

import { useCallback, useEffect } from "react"
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"

import { Button } from "@/shared/ui/button"
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
} from "lucide-react"

interface Props {
  content: JSONContent | null
  onChange: (json: JSONContent) => void
}

export function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-32 px-3 py-2 text-sm leading-relaxed [&_p]:my-1 [&_h1]:text-lg [&_h1]:font-heading [&_h1]:font-medium [&_h2]:text-base [&_h2]:font-heading [&_h2]:font-medium [&_h3]:text-sm [&_h3]:font-medium [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_li]:my-0.5 [&_blockquote]:border-s-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-xs [&_img]:rounded-lg [&_img]:border [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
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
      <Toolbar editor={editor} setLink={setLink} addImage={addImage} />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor, setLink, addImage }: { editor: NonNullable<ReturnType<typeof useEditor>>; setLink: () => void; addImage: () => void }) {
  const btn = (label: string, active: boolean, onClick: () => void, icon: React.ReactNode) => (
    <Button key={label} variant="ghost" size="icon-sm" onClick={onClick} data-active={active} className="data-active:bg-muted data-active:text-foreground">{icon}</Button>
  )

  return (
    <div className="flex items-center gap-0.5 border-b bg-muted/30 px-1 py-1">
      {btn("bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <BoldIcon className="size-3.5" />)}
      {btn("italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <ItalicIcon className="size-3.5" />)}
      <div className="mx-0.5 h-4 w-px bg-border" />
      {btn("h1", editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1Icon className="size-3.5" />)}
      {btn("h2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2Icon className="size-3.5" />)}
      {btn("h3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3Icon className="size-3.5" />)}
      <div className="mx-0.5 h-4 w-px bg-border" />
      {btn("blockquote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <TextQuoteIcon className="size-3.5" />)}
      {btn("code", editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), <CodeIcon className="size-3.5" />)}
      <div className="mx-0.5 h-4 w-px bg-border" />
      {btn("link", editor.isActive("link"), setLink, <LinkIcon className="size-3.5" />)}
      <Button variant="ghost" size="icon-sm" onClick={addImage}><ImageIcon className="size-3.5" /></Button>
    </div>
  )
}
