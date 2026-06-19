export function barWidth(value: number, max: number): string {
  if (value <= 0 || max <= 0) return '0%';

  return `${Math.max((value / max) * 100, 4)}%`;
}
