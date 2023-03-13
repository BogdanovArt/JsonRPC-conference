import { MenuStateData } from "./types";

const sortMenuData = (menu: MenuStateData) => {
  const sorted: MenuStateData = [];
  const children: { [key: string]: MenuStateData } = {};
  menu.forEach((item) => {
    if (!item.parent) sorted.push(item);
    else {
      if (!children[item.parent]) children[item.parent] = [];
      children[item.parent].push(item);
    }
  });
  sortArray(sorted);
  Object.keys(children).forEach((key) => {
    sortArray(children[key]);
    const parentIndex = sorted.findIndex((item) => item.code === key);
    if (parentIndex > -1) {
      sorted.splice(parentIndex + 1, 0, ...children[key]);
    }
  });

  return sorted;
};

export const getSorter = (key: string) => {
  return (a: any, b: any) => {
    if (a[key] && b[key] && a[key] < b[key]) return -1;
    return 1;
  }
}

export const sortArray = (array: any, key = "order") => {
  const sorter = getSorter(key);
  array.sort(sorter);
};

export default sortMenuData;