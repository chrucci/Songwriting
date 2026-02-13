import type { Progression } from './signals'

const STORAGE_KEY = 'chord-explorer-progressions'

interface StoredData {
  version: 1
  progressions: Progression[]
}

/**
 * Repository pattern for persisting progressions in localStorage.
 */
export class ProgressionRepository {
  /** Load all saved progressions. */
  loadAll(): Progression[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const data: StoredData = JSON.parse(raw)
      return data.progressions ?? []
    } catch {
      return []
    }
  }

  /** Save a progression (upsert by id). */
  save(progression: Progression): void {
    const all = this.loadAll()
    const idx = all.findIndex(p => p.id === progression.id)
    if (idx !== -1) {
      all[idx] = progression
    } else {
      all.push(progression)
    }
    this.writeAll(all)
  }

  /** Delete a progression by id. */
  delete(id: string): void {
    const all = this.loadAll().filter(p => p.id !== id)
    this.writeAll(all)
  }

  private writeAll(progressions: Progression[]): void {
    const data: StoredData = { version: 1, progressions }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}
