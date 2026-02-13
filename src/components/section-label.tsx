import { updateSectionLabel, removeSection } from '../state/signals'
import type { Section } from '../state/signals'

const PRESET_LABELS = ['Verse', 'Chorus', 'Bridge', 'Intro', 'Outro', 'Pre-Chorus']

interface SectionLabelProps {
  section: Section
}

export function SectionLabel({ section }: SectionLabelProps) {
  return (
    <div class="section-label">
      <select
        class="section-label__select"
        value={PRESET_LABELS.includes(section.label) ? section.label : '__custom__'}
        onChange={(e) => {
          const val = (e.target as HTMLSelectElement).value
          if (val !== '__custom__') {
            updateSectionLabel(section.id, val)
          }
        }}
      >
        {PRESET_LABELS.map(label => (
          <option key={label} value={label}>{label}</option>
        ))}
        <option value="__custom__">Custom...</option>
      </select>
      {!PRESET_LABELS.includes(section.label) && (
        <input
          class="section-label__input"
          type="text"
          value={section.label}
          onInput={(e) => {
            updateSectionLabel(section.id, (e.target as HTMLInputElement).value)
          }}
          placeholder="Section name"
        />
      )}
      <button
        class="section-label__delete"
        onClick={() => removeSection(section.id)}
        title="Remove section"
        aria-label={`Remove ${section.label} section`}
      >
        &times;
      </button>
    </div>
  )
}
