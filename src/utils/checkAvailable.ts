export function checkAvailable<T>(
  variable: T | null | undefined,
  name = 'variable',
): T {
  if (variable == null) {
    throw new Error(`'${name}' is missing value (${String(variable)})`);
  }

  return variable;
}
