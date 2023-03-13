export const highlight = (source: string, search: string) => {
  let __html = source;
  if (search && source) {
    __html = __html.replace(search, `<span class="highlight">${search}</span>`);
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html }}
      style={{ display: "inline-flex" }}
      className="search-highlight"
    />
  );
};
