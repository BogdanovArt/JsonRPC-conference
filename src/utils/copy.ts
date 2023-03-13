export function copy<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}
