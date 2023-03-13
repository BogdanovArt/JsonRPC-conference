export const getRandomString = (length: number) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  return Array.from(
    { length },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomElement = <T>(items: Array<T>): T => {
  return items[Math.floor(Math.random() * items.length)];
};
