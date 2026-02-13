import {
  currentProgression, selectedKeyRoot, selectedMode,
} from '../state/signals'
import { ClassicalFunctionAnalyzer } from '../theory/classical-function-analyzer'
import { SyntacticalFunctionAnalyzer } from '../theory/syntactical-function-analyzer'

const classical = new ClassicalFunctionAnalyzer()
const syntactical = new SyntacticalFunctionAnalyzer()

const FUNCTION_COLORS = {
  T: 'var(--color-tonic)',
  S: 'var(--color-subdominant)',
  D: 'var(--color-dominant)',
}

export function FunctionLabelDisplay() {
  const prog = currentProgression.value
  const keyRoot = selectedKeyRoot.value
  const mode = selectedMode.value

  const sections = prog.sections.filter(s => s.chords.length > 0)
  if (sections.length === 0) return null

  return (
    <div class="function-labels">
      <h3 class="function-labels__title">Function Analysis</h3>
      {sections.map(section => {
        const chords = section.chords.map(s => s.chord)
        const syntacticalLabels = syntactical.analyzeSection(chords, keyRoot, mode)

        return (
          <div key={section.id} class="function-labels__section">
            <span class="function-labels__section-name">{section.label}</span>
            <div class="function-labels__row">
              {section.chords.map((slot, i) => {
                const classicalLabel = classical.analyze(slot.chord, keyRoot, mode)
                const syntacticalLabel = syntacticalLabels[i]
                return (
                  <div key={slot.id} class="function-labels__chord">
                    <span class="function-labels__roman">{classicalLabel.romanNumeral}</span>
                    <span
                      class="function-labels__func"
                      style={{ color: FUNCTION_COLORS[classicalLabel.func] }}
                      title={classicalLabel.explanation}
                    >
                      {classicalLabel.func}
                    </span>
                    <span
                      class="function-labels__syntactical"
                      title={syntacticalLabel.explanation}
                    >
                      {syntacticalLabel.role.split('-')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
