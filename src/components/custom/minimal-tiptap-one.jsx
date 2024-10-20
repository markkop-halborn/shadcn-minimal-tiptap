import * as React from 'react'
import '@/components/minimal-tiptap/styles/index.css'

import { EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { SectionTwo } from '@/components/minimal-tiptap/components/section/two'
import { LinkBubbleMenu } from '@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu'
import { useMinimalTiptapEditor } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap'

export const MinimalTiptapOne = React.forwardRef(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
      >
        <EditorContent editor={editor} className={cn('minimal-tiptap-editor', editorContentClassName)} />
        <Toolbar editor={editor} />
        <LinkBubbleMenu editor={editor} />
      </div>
    )
  }
)

MinimalTiptapOne.displayName = 'MinimalTiptapOne'

const Toolbar = ({ editor }) => (
  <div className="shrink-0 overflow-x-auto border-t border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionTwo editor={editor} activeActions={['bold', 'italic', 'strikethrough', 'code']} mainActionCount={5} />
    </div>
  </div>
)

export default MinimalTiptapOne
