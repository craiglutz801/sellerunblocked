/**
 * Shared 0–100 index.
 * A rating is converted once: 100 × (value − min) / (max − min) when higher is better,
 * or 100 × (max − value) / (max − min) when lower is better.
 * A 4 on a 1–5 higher-is-better scale is 75.
 * Missing and not-applicable values never enter the sum or the denominator.
 */

export function ratingToIndex(value: number, min: number, max: number, higherIsBetter: boolean): number {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max === min) {
    throw new Error('Rating scale is invalid')
  }
  if (value < min || value > max) {
    throw new Error('Rating is outside the scale')
  }
  const span = max - min
  const ratio = higherIsBetter ? (value - min) / span : (max - value) / span
  return Math.round(ratio * 100)
}

/** Rounded mean of converted ratings. Null when every value is missing. Never returns 0 for an empty set. */
export function meanIndex(
  values: Array<number | null | undefined>,
  scale: { min: number; max: number; higherIsBetter: boolean } = { min: 1, max: 5, higherIsBetter: true },
): number | null {
  const scores: number[] = []
  for (const value of values) {
    if (value == null || !Number.isFinite(value)) continue
    scores.push(ratingToIndex(value, scale.min, scale.max, scale.higherIsBetter))
  }
  if (!scores.length) return null
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}
