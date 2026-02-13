import { signal } from '@preact/signals'
import {
  selectedChordSlotId, currentProgression, preferFlats,
  addChordToSection, selectedKeyRoot, selectedMode,
} from '../state/signals'
import { HarmonicToolkit } from '../theory/harmonic-toolkit'
import { Chord } from '../theory/chord'

const toolkit = new HarmonicToolkit()
const toolResult = signal<{ label: string; chords: Chord[] } | null>(null)

function findSelectedChord(): Chord | null {
  const slotId = selectedChordSlotId.value
  if (!slotId) return null
  for (const section of currentProgression.value.sections) {
    const slot = section.chords.find(c => c.id === slotId)
    if (slot) return slot.chord
  }
  return null
}

export function HarmonicToolsPanel() {
  const chord = findSelectedChord()
  const flats = preferFlats.value

  if (!chord) {
    return (
      <div class="harmonic-tools">
        <h3 class="harmonic-tools__title">Harmonic Tools</h3>
        <p class="harmonic-tools__hint">Select a chord in the progression to use harmonic tools.</p>
      </div>
    )
  }

  const result = toolResult.value

  return (
    <div class="harmonic-tools">
      <h3 class="harmonic-tools__title">
        Tools for {chord.symbol(flats)}
      </h3>
      <div class="harmonic-tools__buttons">
        <button
          class="btn btn--small"
          onClick={() => {
            const sec = toolkit.secondaryDominant(chord)
            toolResult.value = { label: `V/${chord.symbol(flats)}`, chords: [sec] }
          }}
        >
          Secondary Dom
        </button>
        <button
          class="btn btn--small"
          onClick={() => {
            const chain = toolkit.dominantChain(chord, 3)
            toolResult.value = { label: 'Dominant Chain', chords: chain }
          }}
        >
          Dom Chain
        </button>
        <button
          class="btn btn--small"
          onClick={() => {
            const sub = toolkit.tritoneSubstitution(chord)
            toolResult.value = { label: 'Tritone Sub', chords: [sub] }
          }}
        >
          Tritone Sub
        </button>
        <button
          class="btn btn--small"
          onClick={() => {
            const pivots = toolkit.pivotChords(
              selectedKeyRoot.value, selectedMode.value,
              (chord.root.value + 7) % 12, 'major',
            )
            toolResult.value = { label: `Pivots to ${chord.symbol(flats)} key`, chords: pivots }
          }}
        >
          Pivot Chords
        </button>
      </div>

      {result && (
        <div class="harmonic-tools__result">
          <h4 class="harmonic-tools__result-label">{result.label}</h4>
          <div class="harmonic-tools__result-chords">
            {result.chords.map((c, i) => (
              <button
                key={`${c.root.value}-${c.quality}-${i}`}
                class="chord-card"
                style={{ borderColor: 'var(--color-tonic)' }}
                onClick={() => addChordToSection(c)}
                title={`Click to add ${c.symbol(flats)}`}
              >
                <span class="chord-card__symbol">{c.symbol(flats)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
