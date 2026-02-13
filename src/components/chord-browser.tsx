import { groupedChords, diatonicChords } from '../state/signals'
import { ChordCard } from './chord-card'
import { proximityLabel } from '../utils/color'
import type { ProximityLevel } from '../theory/proximity-engine'

const SECTIONS: ProximityLevel[] = ['tonic', 'close', 'medium', 'far']

export function ChordBrowser() {
  const groups = groupedChords.value
  const diatonic = diatonicChords.value

  return (
    <aside class="chord-browser">
      <h2 class="chord-browser__title">Chord Palette</h2>

      {/* Tonic group */}
      <div class="chord-browser__group chord-browser__group--tonic">
        <h3 class="chord-browser__group-title">
          {proximityLabel('tonic')}
          <span class="chord-browser__count">{groups.tonic.length}</span>
        </h3>
        <div class="chord-browser__grid">
          {groups.tonic.map(ranked => (
            <ChordCard key={`${ranked.chord.root.value}-${ranked.chord.quality}`} ranked={ranked} />
          ))}
        </div>
      </div>

      {/* Diatonic (In Key) group */}
      {diatonic.length > 0 && (
        <div class="chord-browser__group chord-browser__group--diatonic">
          <h3 class="chord-browser__group-title">
            In Key
            <span class="chord-browser__count">{diatonic.length}</span>
          </h3>
          <div class="chord-browser__grid">
            {diatonic.map(ranked => (
              <ChordCard key={`${ranked.chord.root.value}-${ranked.chord.quality}`} ranked={ranked} />
            ))}
          </div>
        </div>
      )}

      {/* Proximity groups */}
      {SECTIONS.filter(l => l !== 'tonic').map(level => (
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
