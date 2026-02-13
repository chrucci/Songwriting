import { groupedChords } from '../state/signals'
import { ChordCard } from './chord-card'
import { proximityLabel } from '../utils/color'
import type { ProximityLevel } from '../theory/proximity-engine'

const SECTIONS: ProximityLevel[] = ['tonic', 'close', 'medium', 'far']

export function ChordBrowser() {
  const groups = groupedChords.value

  return (
    <aside class="chord-browser">
      <h2 class="chord-browser__title">Chord Palette</h2>
      {SECTIONS.map(level => (
        <div key={level} class={`chord-browser__group chord-browser__group--${level}`}>
          <h3 class="chord-browser__group-title">
            {proximityLabel(level)}
            <span class="chord-browser__count">{groups[level].length}</span>
          </h3>
          <div class="chord-browser__grid">
            {groups[level].map(ranked => (
              <ChordCard key={`${ranked.chord.root.value}-${ranked.chord.quality}`} ranked={ranked} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}
