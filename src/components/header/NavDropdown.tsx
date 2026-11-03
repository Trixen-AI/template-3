import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const SHOW_DELAY = 150
const HIDE_DELAY = 150
const TRANSITION_MS = 300

type Phase = 'closed' | 'enter' | 'entering' | 'open' | 'leave'

interface NavDropdownProps {
  label: string
  popperClass: string
  children: ReactNode
}

/**
 * Hover dropdown matching Element Plus's ElDropdown as the source configures it:
 * trigger "hover", placement "bottom", offset 0, fixed strategy, el-zoom-in-top transition.
 */
export function NavDropdown({ label, popperClass, children }: NavDropdownProps) {
  const id = useId()
  const referenceRef = useRef<HTMLDivElement>(null)
  const popperRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [phase, setPhase] = useState<Phase>('closed')
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const clear = () => window.clearTimeout(timer.current)
  const show = () => {
    clear()
    timer.current = window.setTimeout(() => setPhase((p) => (p === 'closed' || p === 'leave' ? 'enter' : p)), SHOW_DELAY)
  }
  const hide = () => {
    clear()
    timer.current = window.setTimeout(() => setPhase((p) => (p === 'closed' ? p : 'leave')), HIDE_DELAY)
  }

  useLayoutEffect(() => {
    if (phase !== 'enter') return
    const reference = referenceRef.current
    const popper = popperRef.current
    if (!reference || !popper) return
    const rect = reference.getBoundingClientRect()
    setPosition({ top: rect.bottom, left: rect.left + rect.width / 2 - popper.offsetWidth / 2 })
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('entering')))
    return () => cancelAnimationFrame(frame)
  }, [phase])

  useEffect(() => {
    if (phase !== 'entering') return
    const t = window.setTimeout(() => setPhase('open'), TRANSITION_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leave') return
    const t = window.setTimeout(() => setPhase('closed'), TRANSITION_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => clear, [])

  const transitionClass =
    phase === 'enter'
      ? 'el-zoom-in-top-enter-active el-zoom-in-top-enter-from'
      : phase === 'entering'
        ? 'el-zoom-in-top-enter-active'
        : phase === 'leave' ? 'el-zoom-in-top-leave-active' : ''

  return (
    <div ref={referenceRef} className="el-dropdown" onMouseEnter={show} onMouseLeave={hide}>
      <span
        className="pnh-trigger text-white inline-flex items-center gap-[.06rem] el-tooltip__trigger"
        role="button"
        tabIndex={0}
        aria-controls={id}
        aria-expanded={phase !== 'closed' && phase !== 'leave'}
        aria-haspopup="menu"
        onFocus={show}
        onBlur={hide}
      >
        {label} <i className="pnh-arrow" />
      </span>
      {phase !== 'closed'
        ? createPortal(
            <div
              ref={popperRef}
              id={id}
              role="menu"
              className={`el-popper is-pure is-light el-tooltip el-dropdown__popper ${popperClass} ${transitionClass}`}
              data-popper-placement="bottom"
              style={{ zIndex: 2003, position: 'fixed', inset: `${position.top}px auto auto ${position.left}px` }}
              onMouseEnter={show}
              onMouseLeave={hide}
            >
              <div className="el-scrollbar">
                <div className="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
                  <div className="el-scrollbar__view el-dropdown__list">{children}</div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
