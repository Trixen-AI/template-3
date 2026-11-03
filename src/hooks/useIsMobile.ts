import { useSyncExternalStore } from 'react'

const MOBILE_MAX_WIDTH = 1024
const query = `(max-width: ${MOBILE_MAX_WIDTH}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(query).matches

/** True at widths of 1024px and below (source: fa()). */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
