import { selectedChordSlotId, removeChordSlot, preferFlats, tonicChord } from '../state/signals'
import type { ChordSlot as ChordSlotType } from '../state/signals'
import { ProximityEngine } from '../theory/proximity-engine'
import { proximityColor } from '../utils/color'

const engine = new ProximityEngine()

interface ChordSlotProps {
  slot: ChordSlotType
}

export function ChordSlot({ slot }: ChordSlotProps) {
  const isSelected = selectedChordSlotId.value === slot.id
  const flats = preferFlats.value
  const ranked = engine.computeProximity(tonicChord.value, slot.chord)
  const color = proximityColor(ranked.proximity)

  return (
    <div
      class={`chord-slot ${isSelected ? 'chord-slot--selected' : ''}`}
      style={{ borderBottomColor: color }}
      onClick={() => { selectedChordSlotId.value = slot.id }}
    >
      <span class="chord-slot__symbol">{slot.chord.symbol(flats)}</span>
      <span class="chord-slot__dot" style={{ background: color }} />
      <button
        class="chord-slot__delete"
        onClick={(e) => {
          e.stopPropagation()
          removeChordSlot(slot.id)
        }}
        title="Remove chord"
        aria-label={`Remove ${slot.chord.symbol(flats)}`}
      >
        &times;
      </button>
    </div>
  )
}
