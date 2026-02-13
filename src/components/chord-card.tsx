import type { RankedChord } from '../theory/proximity-engine'
import { preferFlats, addChordToSection } from '../state/signals'
import { proximityColor } from '../utils/color'

interface ChordCardProps {
  ranked: RankedChord
}

export function ChordCard({ ranked }: ChordCardProps) {
  const { chord, proximity, sharedNotes, sharedNoteCount } = ranked
  const color = proximityColor(proximity)
  const flats = preferFlats.value

  return (
    <button
      class="chord-card"
      style={{ borderColor: color }}
      onClick={() => addChordToSection(chord)}
      title={`${chord.symbol(flats)} — ${sharedNoteCount} shared note${sharedNoteCount !== 1 ? 's' : ''} with tonic`}
    >
      <span class="chord-card__symbol">{chord.symbol(flats)}</span>
      <span class="chord-card__shared" style={{ color }}>
        {sharedNotes.map(n => n.name(flats)).join(', ') || '—'}
      </span>
    </button>
  )
}
