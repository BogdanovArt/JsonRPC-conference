import addLeadingZero from "./addLeadingZero";

export const formatDuration = (duration: number, seconds = true) => {
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = duration % 60;
  if (!seconds) {
    return `${h}:${addLeadingZero(m)}`;
  }
  if (h >= 1) {
    return `${h}:${addLeadingZero(m)}:${addLeadingZero(s.toFixed(0))}`;
  }
  return `${addLeadingZero(m)}:${addLeadingZero(s.toFixed(0))}`;
};
