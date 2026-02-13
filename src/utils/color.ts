import type { ProximityLevel } from '../theory/proximity-engine'

/** Map proximity level to a CSS color variable name. */
export function proximityColor(level: ProximityLevel): string {
  const colors: Record<ProximityLevel, string> = {
    close: 'var(--color-close)',
    medium: 'var(--color-medium)',
    far: 'var(--color-far)',
  }
  return colors[level]
}

/** Map proximity level to a human-readable label. */
export function proximityLabel(level: ProximityLevel): string {
  const labels: Record<ProximityLevel, string> = {
    close: 'Close (2 shared)',
    medium: 'Medium (1 shared)',
    far: 'Far (0 shared)',
  }
  return labels[level]
}
