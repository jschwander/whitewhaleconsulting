'use client';

import { useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

function ToolbarDivider() {
  return (
    <span className="mx-1 select-none text-slate-300" aria-hidden>
      |
    </span>
  );
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-[13px] leading-none text-navy-heading transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? 'bg-teal text-white hover:bg-teal' : ''
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextToolbar({
  editor,
  onInsertImage,
}: {
  editor: Editor;
  onInsertImage?: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor.isActive('bold'),
      italic: ctx.editor.isActive('italic'),
      underline: ctx.editor.isActive('underline'),
      h2: ctx.editor.isActive('heading', { level: 2 }),
      h3: ctx.editor.isActive('heading', { level: 3 }),
      paragraph:
        ctx.editor.isActive('paragraph') &&
        !ctx.editor.isActive('heading') &&
        !ctx.editor.isActive('bulletList') &&
        !ctx.editor.isActive('orderedList'),
      bulletList: ctx.editor.isActive('bulletList'),
      orderedList: ctx.editor.isActive('orderedList'),
      link: ctx.editor.isActive('link'),
    }),
  });

  function setLink() {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="sticky top-16 md:top-20 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-page px-2 py-1.5"
    >
      <ToolbarButton
        title="Bold"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        title="Heading 2"
        active={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Normal text"
        active={state.paragraph}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Normal
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        title="Bullet list"
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton title="Link" active={state.link} onClick={setLink}>
        Link
      </ToolbarButton>
      {onInsertImage ? (
        <ToolbarButton title="Insert image" onClick={onInsertImage}>
          Image
        </ToolbarButton>
      ) : null}
      <ToolbarButton
        title="Remove formatting"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        Clear
      </ToolbarButton>
    </div>
  );
}