export function parseNumber(value: string): number {
  console.log("Parsing number", value);
  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error("Invalid number");
  }

  return parsed;
}
