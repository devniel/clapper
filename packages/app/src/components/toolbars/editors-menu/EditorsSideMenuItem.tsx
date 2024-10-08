import { ReactNode } from 'react'
import { EditorView } from '@aitube/clapper-services'

import { cn } from '@/lib/utils'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEditors } from '@/services/editors/useEditors'
import { useTheme } from '@/services/ui/useTheme'

export function EditorsSideMenuItem({
  children,
  view: expectedView,
  label,
  unmanaged,
}: {
  children: ReactNode

  /**
   * Name of the side menu item
   */
  view?: EditorView

  /**
   * Label of the tooltip
   */
  label?: string

  /**
   * If the side menu item is just for show, and managed externally
   */
  unmanaged?: boolean
}) {
  const theme = useTheme()
  const view = useEditors((s) => s.view)
  const setView = useEditors((s) => s.setView)

  const isActive = !unmanaged && view === expectedView

  const tooltipLabel = label || expectedView

  const handleClick = () => {
    // nothing to do if there is no name or if we are already selecterd
    if (unmanaged || !expectedView || isActive) {
      return
    }

    console.log(`handleClick("${expectedView}")`)
    setView(expectedView)
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger
        asChild
        disabled={!tooltipLabel}
        className="h-8 w-full transition-all duration-200 ease-in-out md:h-9 xl:h-11"
      >
        <div
          className={cn(
            `flex h-8 w-full flex-col md:h-9 xl:h-11`,
            `transition-all duration-150 ease-out`,
            `items-center justify-center`,
            unmanaged || isActive ? '' : `cursor-pointer`,
            `border-l-[1px] md:border-l-[1.5px] lg:border-l-[2px]`,
            `transition-all duration-200 ease-in-out`,
            isActive
              ? 'fill-neutral-50/80 text-neutral-50 opacity-100 hover:fill-neutral-50 hover:text-neutral-50'
              : 'fill-neutral-400/80 text-gray-400 opacity-80 hover:fill-neutral-200 hover:text-neutral-200 hover:opacity-100',
            `group`
          )}
          style={{
            // background: theme.editorMenuBgColor || theme.defaultBgColor || "#eeeeee",
            borderColor: isActive
              ? theme.defaultPrimaryColor || '#ffffff'
              : 'rgba(0,0,0,0)',
          }}
          onClick={handleClick}
        >
          <div
            className={cn(
              `flex-col items-center justify-center`,
              `text-center`,
              `text-[20px] md:text-[22px] lg:text-[24px] xl:text-[28px]`,
              `transition-all duration-200 ease-out`,
              `stroke-1`,
              isActive ? `scale-110` : `group-hover:scale-110`
            )}
          >
            {children}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="text-xs">{tooltipLabel}</p>
      </TooltipContent>
    </Tooltip>
  )
}
