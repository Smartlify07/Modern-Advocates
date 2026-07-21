"use client"

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Link from "@tiptap/extension-link"
import { useEffect, useCallback } from "react"
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  LinkIcon,
} from "lucide-react"

function ToolbarButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={label} className={`flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700 ${active ? "bg-slate-200 text-slate-700" : ""}`}>
      {children}
    </button>
  )
}

export function OverviewEditor({ content, onChange }: { content: JSONContent | null; onChange: (json: JSONContent) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Strike, Link.configure({ openOnClick: false })],
    content: content ?? "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-32 px-3 py-2 text-sm leading-relaxed [&_p]:my-1 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_a]:text-primary [&_a]:underline",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  useEffect(() => { return () => editor?.destroy() }, [editor])
  useEffect(() => {
    if (editor && content) {
      const currentJson = editor.getJSON()
      if (JSON.stringify(currentJson) !== JSON.stringify(content)) editor.commands.setContent(content)
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Link URL", editor.getAttributes("link").href ?? "")
    if (url === null) return
    url === "" ? editor.chain().focus().extendMarkRange("link").unsetLink().run() : editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
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
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold"><BoldIcon className="size-3.5" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic"><ItalicIcon className="size-3.5" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline"><span className="text-xs font-bold underline">U</span></ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strikethrough"><StrikethroughIcon className="size-3.5" /></ToolbarButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <ToolbarButton active={editor.isActive("link")} onClick={setLink} label="Link"><LinkIcon className="size-3.5" /></ToolbarButton>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet List"><ListIcon className="size-3.5" /></ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered List"><ListOrderedIcon className="size-3.5" /></ToolbarButton>
      </div>
    </div>
  )
}
