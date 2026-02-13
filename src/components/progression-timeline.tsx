import { currentProgression, addSection, activeSectionId } from '../state/signals'
import { SectionLabel } from './section-label'
import { ChordSlot } from './chord-slot'

export function ProgressionTimeline() {
  const prog = currentProgression.value

  return (
    <div class="progression-timeline">
      <div class="progression-timeline__header">
        <h2 class="progression-timeline__title">Progression</h2>
        <button
          class="btn btn--small"
          onClick={() => addSection('Verse')}
        >
          + Section
        </button>
      </div>

      {prog.sections.length === 0 && (
        <div class="placeholder">
          <p>No sections yet. Add a section to get started.</p>
        </div>
      )}

      {prog.sections.map(section => {
        const isActive = activeSectionId.value === section.id
        return (
          <div
            key={section.id}
            class={`timeline-section ${isActive ? 'timeline-section--active' : ''}`}
            onClick={() => { activeSectionId.value = section.id }}
          >
            <SectionLabel section={section} />
            <div class="timeline-section__chords">
              {section.chords.map(slot => (
                <ChordSlot key={slot.id} slot={slot} />
              ))}
              {section.chords.length === 0 && (
                <div class="timeline-section__empty">
                  Click a chord from the palette to add it here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
