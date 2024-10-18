import * as React from 'react'
import { cn } from '@/lib/utils'
import { getShortcutKey } from '../utils'

export const ShortcutKey = React.forwardRef((props, ref) => {
  const { className, keys, ...rest } = props
  const modifiedKeys = keys.map(key => getShortcutKey(key))
  const ariaLabel = modifiedKeys.map(shortcut => shortcut.readable).join(' + ')

  return (
    <span aria-label={ariaLabel} className={cn('inline-flex items-center gap-0.5', className)} {...rest} ref={ref}>
      {modifiedKeys.map(shortcut => (
        <kbd
          key={shortcut.symbol}
          className={cn(
            'inline-block min-w-2.5 text-center align-baseline font-sans text-xs font-medium capitalize text-[rgb(156,157,160)]',
            className
          )}
          {...rest}
          ref={ref}
        >
          {shortcut.symbol}
        </kbd>
      ))}
    </span>
  )
})

ShortcutKey.displayName = 'ShortcutKey'
