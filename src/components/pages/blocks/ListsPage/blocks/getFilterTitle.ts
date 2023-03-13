export const getFilterTitle = (title: string) => {
  switch (title) {
    case null:
      return "Все контакты";
    case "":
      return "Не указано";
    default:
      return title;
  }
};
