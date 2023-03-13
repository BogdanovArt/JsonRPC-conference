export const uniqueArray = (array: Array<unknown>) => {
  const ref: { [key: string]: null } = {};
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (value?.toString) ref[value.toString()] = null;
  }
  return Object.keys(ref);
};
