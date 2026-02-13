import {
  currentProgression, tonicChord, preferFlats,
} from '../state/signals'
import { ProximityEngine } from '../theory/proximity-engine'
import { proximityColor } from '../utils/color'

const engine = new ProximityEngine()

/** Circle of fifths order for angular positioning. */
const CIRCLE_OF_FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]

function rootToAngle(rootValue: number): number {
  const index = CIRCLE_OF_FIFTHS.indexOf(rootValue)
  return (index / 12) * 360 - 90 // start at top
}

const RING_RADII: Record<string, number> = { tonic: 0, close: 60, medium: 110, far: 155 }
const CENTER = 180
const SVG_SIZE = 360

export function RadialVisualization() {
  const tonic = tonicChord.value
  const flats = preferFlats.value
  const prog = currentProgression.value

  // Collect all chords from all sections
  const allSlots = prog.sections.flatMap(s => s.chords)

  if (allSlots.length === 0) {
    return (
      <div class="radial-viz">
        <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
          {/* Concentric rings */}
          {Object.entries(RING_RADII).filter(([, r]) => r > 0).map(([level, r]) => (
            <circle
              key={level}
              cx={CENTER} cy={CENTER} r={r}
              fill="none"
              stroke="var(--border-color)"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
          ))}
          {/* Tonic at center */}
          <circle cx={CENTER} cy={CENTER} r={20} fill="var(--color-tonic)" opacity={0.2} />
          <text
            x={CENTER} y={CENTER + 4}
            text-anchor="middle"
            fill="var(--color-tonic)"
            font-size="12"
            font-weight="bold"
          >
            {tonic.symbol(flats)}
          </text>
        </svg>
      </div>
    )
  }

  // Compute positions for each chord
  const positions = allSlots.map(slot => {
    const ranked = engine.computeProximity(tonic, slot.chord)
    const radius = RING_RADII[ranked.proximity]
    const angle = (rootToAngle(slot.chord.root.value) * Math.PI) / 180
    return {
      slot,
      ranked,
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
    }
  })

  return (
    <div class="radial-viz">
      <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        {/* Concentric rings */}
        {Object.entries(RING_RADII).filter(([, r]) => r > 0).map(([level, r]) => (
          <circle
            key={level}
            cx={CENTER} cy={CENTER} r={r}
            fill="none"
            stroke="var(--border-color)"
            stroke-width="1"
            stroke-dasharray="4 4"
          />
        ))}

        {/* Journey line connecting chords in order */}
        {positions.length > 1 && (
          <polyline
            points={positions.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="var(--text-muted)"
            stroke-width="1.5"
            stroke-opacity="0.5"
            stroke-linejoin="round"
          />
        )}

        {/* Arrow at end of journey */}
        {positions.length > 1 && (() => {
          const last = positions[positions.length - 1]
          const prev = positions[positions.length - 2]
          const angle = Math.atan2(last.y - prev.y, last.x - prev.x)
          const arrowSize = 8
          return (
            <polygon
              points={`
                ${last.x},${last.y}
                ${last.x - arrowSize * Math.cos(angle - 0.4)},${last.y - arrowSize * Math.sin(angle - 0.4)}
                ${last.x - arrowSize * Math.cos(angle + 0.4)},${last.y - arrowSize * Math.sin(angle + 0.4)}
              `}
              fill="var(--text-muted)"
              opacity="0.5"
            />
          )
        })()}

        {/* Tonic at center */}
        <circle cx={CENTER} cy={CENTER} r={20} fill="var(--color-tonic)" opacity={0.2} />
        <text
          x={CENTER} y={CENTER + 4}
          text-anchor="middle"
          fill="var(--color-tonic)"
          font-size="12"
          font-weight="bold"
        >
          {tonic.symbol(flats)}
        </text>

        {/* Chord dots */}
        {positions.map((p, i) => (
          <g key={`${p.slot.id}-${i}`}>
            <circle
              cx={p.x} cy={p.y} r={14}
              fill={proximityColor(p.ranked.proximity)}
              opacity={0.15}
            />
            <circle
              cx={p.x} cy={p.y} r={14}
              fill="none"
              stroke={proximityColor(p.ranked.proximity)}
              stroke-width="1.5"
            />
            <text
              x={p.x} y={p.y + 4}
              text-anchor="middle"
              fill="var(--text-accent)"
              font-size="9"
              font-weight="600"
            >
              {p.slot.chord.symbol(flats)}
            </text>
            {/* Step number */}
            <text
              x={p.x} y={p.y - 10}
              text-anchor="middle"
              fill="var(--text-muted)"
              font-size="7"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
