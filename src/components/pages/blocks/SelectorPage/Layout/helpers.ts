const getRowCount = (n: number) => {
  switch (true) {
    case n < 3:
      return 1;
    case n < 9:
      return 2;
    case n < 16:
      return 3;
    case n < 21:
      return 4;
    default:
      return Math.round(Math.sqrt(n));
  }
};

export const getLayoutStructure = (users: number, desktop?: boolean) => {
  if (users >= 36 && desktop) return [6, 6, 6, 6, 6, 6];

  const rows = desktop ? getRowCount(users) : Math.ceil(users / 2);
  let count = rows;
  let structure = Array.from(Array(rows), () => 0);

  for (let i = 0; i < users; i++) {
    if (count > 1) {
      count--;
    } else {
      count = rows;
    }
    structure[count - 1]++;
  }
  
  return structure.sort((a, b) => (a < b ? 1 : -1));
};
