export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

export function sum(
  ...nums: (number | undefined)[] | (readonly (number | undefined)[])[]
): number {
  let tot = 0;
  for (const x of nums) {
    if (x === undefined) {
      tot += 0;
    }
    if (typeof x === 'number') {
      tot += x;
    } else {
      for (const y of x ?? []) {
        tot += y || 0;
      }
    }
  }
  return tot;
}
