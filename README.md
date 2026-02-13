# Chord Explorer — Familiar But Different

A web app for writing chord progressions that blend familiar diatonic harmony with surprising non-diatonic moves. Chords are ranked by **proximity** (shared notes with the tonic), giving you an intuitive map from "safe" to "adventurous."

## Prerequisites

- **Node.js** >= 20 (tested with v22)
- **npm** >= 9

## Installation

```bash
git clone https://github.com/chrucci/Songwriting.git
cd Songwriting
npm install
```

## Running

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The dev server starts at `http://localhost:5173` by default.

## Testing

```bash
# Run all unit tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Type checking only
npm run typecheck
```

134 unit tests cover the music theory engine, function analysis, harmonic tools, voice leading, and guitar voicing database.

## CI/CD

GitHub Actions runs on every push and PR: type check, unit tests, and production build. See `.github/workflows/ci.yml`.

## Usage Guide

### 1. Choose a Key

Use the **key selector** bar at the top to pick a root note (C through B) and mode (Major or Minor). Toggle "Include 7th chords" to expand the chord palette.

### 2. Browse Chords by Proximity

The left panel groups all chords by how many notes they share with your tonic:

- **Close** (green) — 2+ shared notes. Safe, familiar choices.
- **Medium** (amber) — 1 shared note. Adds color without jarring.
- **Far** (red) — 0 shared notes. Bold, surprising moves.

Click any chord card to add it to the active section in your progression.

### 3. Build a Progression

The **timeline** in the center shows your progression organized into sections (Verse, Chorus, Bridge, etc.).

- Click the **+ Section** button to add sections.
- Use the dropdown on each section to change its label.
- Click a chord in the browser to append it to the active (highlighted) section.
- Click a chord slot to select it for harmonic tools and guitar voicings.
- Click the **x** on a chord slot to remove it.

### 4. Visualize Distance

The **radial visualization** displays your progression on concentric rings — tonic at center, close/medium/far on expanding rings. A journey line traces your chord path with numbered steps and arrows.

### 5. Analyze Function

The **function labels** panel shows dual analysis for each chord:

- **Classical** (Riemannian): T (Tonic), S (Subdominant), D (Dominant) with roman numerals.
- **Syntactical** (Nobile): Position-based roles — T-opening, S-transitional, D-penultimate, T-closing.

### 6. Use Harmonic Tools

Select a chord in the progression, then use the **Harmonic Tools** panel (right sidebar):

- **Secondary Dom** — The V7 that resolves to your selected chord.
- **Dom Chain** — A chain of secondary dominants (stacked V7s).
- **Tritone Sub** — A dominant 7th a tritone away from the selected chord's root.
- **Pivot Chords** — Chords diatonic to both the current key and the target key.

Click any result chord to add it to your progression.

### 7. Check Voice Leading

The **voice leading hints** panel flags transitions between adjacent chords. It shows shared note counts and warns (with a marker) when two adjacent chords share zero notes — a potentially rough transition.

### 8. View Guitar Voicings

When a chord is selected, the **Guitar Voicing** panel (right sidebar) renders an SVG chord diagram. Use the Prev/Next buttons to cycle through alternative voicings (open, barre, different positions) when available.

### 9. Play Back

The **playback bar** at the bottom provides:

- **Play / Pause / Stop** controls
- **Tempo slider** (40–200 BPM)

Playback uses the Web Audio API with synthesized tones (no samples required).

### 10. Save, Load, and Export

The **Save & Export** panel (right sidebar):

- **Name** your progression and click **Save** to store it in your browser's local storage.
- **Load** a previously saved progression from the list.
- **Export MIDI** downloads a `.mid` file of your progression.
- **New** resets to a blank progression.

## Tech Stack

| Technology | Purpose |
|---|---|
| Vite + Preact + TypeScript | UI framework with fast HMR |
| @preact/signals | Fine-grained reactive state |
| svguitar | SVG guitar chord diagrams |
| midi-writer-js | MIDI file export |
| Web Audio API | Browser audio playback |
| Vitest | Unit testing |
| GitHub Actions | CI pipeline |

## Project Structure

```
src/
  theory/          Music theory engine (PitchClass, Chord, ProximityEngine, etc.)
  state/           Preact signals and persistence
  components/      UI components
  audio/           Synth engine, playback controller, MIDI export
  data/            Guitar chord voicing database
  styles/          CSS (dark theme)
  utils/           Color mapping, ID generation
```

## License

MIT
