import * as React from 'react'
import { Editor } from '@tiptap/react'
import { FormatAction } from '../../types'
import { toggleVariants } from '@/components/ui/toggle'
import { VariantProps } from 'class-variance-authority'
import {
  CodeIcon,
  DotsHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextNoneIcon
} from '@radix-ui/react-icons'
import { ToolbarSection } from '../toolbar-section'

const formatActions = [
  {
    value: 'bold',
    label: 'Bold',
    icon: <FontBoldIcon className="size-5" />,
    action: editor => editor.chain().focus().toggleBold().run(),
    isActive: editor => editor.isActive('bold'),
    canExecute: editor => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'B']
  },
  {
    value: 'italic',
    label: 'Italic',
    icon: <FontItalicIcon className="size-5" />,
    action: editor => editor.chain().focus().toggleItalic().run(),
    isActive: editor => editor.isActive('italic'),
    canExecute: editor => editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'I']
  },
  {
    value: 'strikethrough',
    label: 'Strikethrough',
    icon: <StrikethroughIcon className="size-5" />,
    action: editor => editor.chain().focus().toggleStrike().run(),
    isActive: editor => editor.isActive('strike'),
    canExecute: editor => editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'shift', 'S']
  },
  {
    value: 'code',
    label: 'Code',
    icon: <CodeIcon className="size-5" />,
    action: editor => editor.chain().focus().toggleCode().run(),
    isActive: editor => editor.isActive('code'),
    canExecute: editor => editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'E']
  },
  {
    value: 'clearFormatting',
    label: 'Clear formatting',
    icon: <TextNoneIcon className="size-5" />,
    action: editor => editor.chain().focus().unsetAllMarks().run(),
    isActive: () => false,
    canExecute: editor => editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', '\\']
  }
]

const SectionTwo = ({
  editor,
  activeActions = formatActions.map(action => action.value),
  mainActionCount = 2,
  size,
  variant
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={<DotsHorizontalIcon className="size-5" />}
      dropdownTooltip="More formatting"
      dropdownClassName="w-8"
      size={size}
      variant={variant}
    />
  )
}

SectionTwo.displayName = 'SectionTwo'

export default SectionTwo
