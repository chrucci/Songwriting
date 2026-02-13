import { selectedKeyRoot, selectedMode, preferFlats, showSevenths } from '../state/signals'
import { NOTE_NAMES_SHARP, NOTE_NAMES_FLAT } from '../theory/constants'

const KEY_ROOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export function KeySelector() {
  const flats = preferFlats.value

  return (
    <div class="key-selector">
      <div class="key-buttons">
        {KEY_ROOTS.map(root => {
          const name = flats
            ? NOTE_NAMES_FLAT[root]
            : NOTE_NAMES_SHARP[root]
          const isSelected = selectedKeyRoot.value === root
          return (
            <button
              key={root}
              class={`key-btn ${isSelected ? 'key-btn--active' : ''}`}
              onClick={() => { selectedKeyRoot.value = root }}
              aria-pressed={isSelected}
            >
              {name}
            </button>
          )
        })}
      </div>
      <div class="key-controls">
        <div class="mode-toggle">
          <button
            class={`mode-btn ${selectedMode.value === 'major' ? 'mode-btn--active' : ''}`}
            onClick={() => { selectedMode.value = 'major' }}
          >
            Major
          </button>
          <button
            class={`mode-btn ${selectedMode.value === 'minor' ? 'mode-btn--active' : ''}`}
            onClick={() => { selectedMode.value = 'minor' }}
          >
            Minor
          </button>
        </div>
        <label class="seventh-toggle">
          <input
            type="checkbox"
            checked={showSevenths.value}
            onChange={(e) => {
              showSevenths.value = (e.target as HTMLInputElement).checked
            }}
          />
          Include 7th chords
        </label>
      </div>
    </div>
  )
}
