export const getTimeFromDate = (time: number) => {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}`;
};
