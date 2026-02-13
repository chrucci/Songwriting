import { useRef, useEffect } from 'preact/hooks'
import Sortable from 'sortablejs'
import {
  currentProgression, addSection, activeSectionId,
  reorderChordsInSection,
} from '../state/signals'
import type { Section } from '../state/signals'
import { SectionLabel } from './section-label'
import { ChordSlot } from './chord-slot'

interface SortableSectionProps {
  section: Section
  isActive: boolean
}

function SortableSection({ section, isActive }: SortableSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sortableRef = useRef<Sortable | null>(null)
  // Keep a ref to the latest chords so the onEnd callback never uses a stale closure
  const chordsRef = useRef(section.chords)
  chordsRef.current = section.chords

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    sortableRef.current = Sortable.create(el, {
      animation: 150,
      ghostClass: 'chord-slot--dragging',
      dataIdAttr: 'data-id',
      onEnd: (evt) => {
        const { from, item, oldIndex, newIndex } = evt

        // If nothing actually moved, bail out
        if (oldIndex === newIndex) return

        // Capture the new order from SortableJS before reverting
        const order = sortableRef.current?.toArray() ?? []

        // Revert SortableJS's DOM manipulation so Preact's VDOM stays in sync.
        // SortableJS physically moves DOM nodes, which desynchronizes Preact's
        // virtual DOM. We must put the node back before updating state.
        if (from && item && oldIndex != null) {
          from.removeChild(item)
          if (oldIndex < from.children.length) {
            from.insertBefore(item, from.children[oldIndex])
          } else {
            from.appendChild(item)
          }
        }

        // Read from the ref (always current) instead of the stale closure
        const currentChords = chordsRef.current
        const chordMap = new Map(currentChords.map(c => [c.id, c]))
        const reordered = order
          .map(id => chordMap.get(id))
          .filter((c): c is NonNullable<typeof c> => c != null)

        // Only apply if we matched all chords (safety check)
        if (reordered.length === currentChords.length) {
          reorderChordsInSection(section.id, reordered)
        }
      },
    })

    return () => {
      sortableRef.current?.destroy()
    }
  }, [section.id])

  return (
    <div
      class={`timeline-section ${isActive ? 'timeline-section--active' : ''}`}
      onClick={() => { activeSectionId.value = section.id }}
    >
      <SectionLabel section={section} />
      <div class="timeline-section__chords" ref={containerRef}>
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
}

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

      {prog.sections.map(section => (
        <SortableSection
          key={section.id}
          section={section}
          isActive={activeSectionId.value === section.id}
        />
      ))}
    </div>
  )
}
