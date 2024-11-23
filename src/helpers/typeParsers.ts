export function parseNumber(value: string): number {
  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error("Invalid number");
  }

  return parsed;
}
