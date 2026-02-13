import { signal, computed } from '@preact/signals'
import { PitchClass } from '../theory/pitch-class'
import { Chord } from '../theory/chord'
import { ChordFactory } from '../theory/chord-factory'
import { ProximityEngine } from '../theory/proximity-engine'
import { Scale } from '../theory/scales'
import { generateId } from '../utils/id-generator'

// ─── Core State ───

export const selectedKeyRoot = signal(0) // C
export const selectedMode = signal<'major' | 'minor'>('major')
export const showSevenths = signal(false)

// ─── Derived State ───

const proximityEngine = new ProximityEngine()

/** The current tonic chord. */
export const tonicChord = computed(() => {
  const root = new PitchClass(selectedKeyRoot.value)
  const quality = selectedMode.value === 'major' ? 'major' : 'minor'
  return new Chord(root, quality as 'major' | 'minor')
})

/** Current scale. */
export const currentScale = computed(() => {
  return selectedMode.value === 'major'
    ? Scale.major(selectedKeyRoot.value)
    : Scale.minor(selectedKeyRoot.value)
})

/** Whether to prefer flat spellings for the current key. */
export const preferFlats = computed(() => currentScale.value.preferFlats)

/** All candidate chords ranked by proximity. */
export const rankedChords = computed(() => {
  const candidates = showSevenths.value
    ? [...ChordFactory.allTriads(), ...ChordFactory.allSevenths()]
    : ChordFactory.allTriads()
  return proximityEngine.rankAll(tonicChord.value, candidates)
})

/** Chords grouped by proximity level. */
export const groupedChords = computed(() => {
  return proximityEngine.groupByProximity(rankedChords.value)
})

// ─── Progression State ───

export interface ChordSlot {
  id: string
  chord: Chord
  durationBeats: number
}

export interface Section {
  id: string
  label: string
  chords: ChordSlot[]
}

export interface Progression {
  id: string
  name: string
  notes: string
  keyRoot: number
  mode: 'major' | 'minor'
  sections: Section[]
  createdAt: number
  updatedAt: number
}

function createDefaultProgression(): Progression {
  return {
    id: generateId(),
    name: 'Untitled',
    notes: '',
    keyRoot: selectedKeyRoot.value,
    mode: selectedMode.value,
    sections: [{
      id: generateId(),
      label: 'Verse',
      chords: [],
    }],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export const currentProgression = signal<Progression>(createDefaultProgression())
export const selectedChordSlotId = signal<string | null>(null)
export const activeSectionId = signal<string | null>(null)

// ─── Progression Actions ───

export function addChordToSection(chord: Chord, sectionId?: string): void {
  const prog = currentProgression.value
  const targetId = sectionId ?? activeSectionId.value ?? prog.sections[0]?.id
  if (!targetId) return

  const slot: ChordSlot = {
    id: generateId(),
    chord,
    durationBeats: 4,
  }

  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: prog.sections.map(s =>
      s.id === targetId
        ? { ...s, chords: [...s.chords, slot] }
        : s,
    ),
  }
}

export function removeChordSlot(slotId: string): void {
  const prog = currentProgression.value
  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: prog.sections.map(s => ({
      ...s,
      chords: s.chords.filter(c => c.id !== slotId),
    })),
  }
  if (selectedChordSlotId.value === slotId) {
    selectedChordSlotId.value = null
  }
}

export function addSection(label = 'Section'): void {
  const prog = currentProgression.value
  const newSection: Section = {
    id: generateId(),
    label,
    chords: [],
  }
  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: [...prog.sections, newSection],
  }
  activeSectionId.value = newSection.id
}

export function removeSection(sectionId: string): void {
  const prog = currentProgression.value
  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: prog.sections.filter(s => s.id !== sectionId),
  }
}

export function updateSectionLabel(sectionId: string, label: string): void {
  const prog = currentProgression.value
  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: prog.sections.map(s =>
      s.id === sectionId ? { ...s, label } : s,
    ),
  }
}

export function reorderChordsInSection(sectionId: string, chords: ChordSlot[]): void {
  const prog = currentProgression.value
  currentProgression.value = {
    ...prog,
    updatedAt: Date.now(),
    sections: prog.sections.map(s =>
      s.id === sectionId ? { ...s, chords } : s,
    ),
  }
}

export function resetProgression(): void {
  currentProgression.value = createDefaultProgression()
  selectedChordSlotId.value = null
  activeSectionId.value = null
}

// ─── Playback State ───

export interface PlaybackState {
  status: 'stopped' | 'playing' | 'paused'
  currentSectionIndex: number
  currentChordIndex: number
}

export const tempo = signal(120)
export const playbackState = signal<PlaybackState>({
  status: 'stopped',
  currentSectionIndex: 0,
  currentChordIndex: 0,
})
