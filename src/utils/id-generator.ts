let counter = 0

/** Generate a unique ID for chord slots and sections. */
export function generateId(): string {
  return `${Date.now()}-${++counter}`
}
