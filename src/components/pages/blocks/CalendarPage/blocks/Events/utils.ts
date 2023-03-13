import { IBasicObject } from "types/index";

export const searchResults = (data: IBasicObject, search: string) => {
  const title = (data.title as string) || "";
  const owner = (data.owner as string) || "";

  const titleResults = title.toLowerCase().includes(search);
  const ownerResults = owner.toLowerCase().includes(search);

  return titleResults || ownerResults;
};
