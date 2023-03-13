export const getDuration = (start: number, end: number) => {
  return Math.max(start, end) - Math.min(start, end);
}