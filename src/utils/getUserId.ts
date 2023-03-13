import { isDev } from "@oktell/utils";

const testId = "828c27c7-017b-c983-2833-fa163e25a239";

export const getUserId = () => {
  const storedId = localStorage.getItem("rUserId");
  const ID = storedId || (isDev() ? testId : "none");
  return ID;
};
