const CSS = require("css");

const parseChildren = function (styles) {
  if (styles.stylesheet && styles.stylesheet.rules) {
    styles.stylesheet.rules.forEach((rule) => {
      if (!rule.selectors) return;

      const parentSelector = rule.selectors[0];
      const declarations = rule.declarations;
      const flexMatch = declarations.find(
        (declaration) =>
          declaration.property === "display" && declaration.value === "flex"
      );
      const gapMatch = declarations.find(
        (declaration) => declaration.property === "gap"
      );
      const directionMatch = declarations.find(
        (declaration) => declaration.property === "flex-direction"
      );

      const shouldModify = !!flexMatch && !!gapMatch;

      if (shouldModify) {
        const selector = `${parentSelector} > *:not(:last-child)`;

        let property = "margin-right";

        if (directionMatch) {
          switch (directionMatch.value) {
            case "column":
              property = "margin-bottom";
              break;
            case "column-reverse":
              property = "margin-top";
              break;
            case "row-reverse":
              property = "margin-left";
            default:
              break;
          }
        }

        styles.stylesheet.rules.push({
          type: "rule",
          selectors: [selector],
          declarations: [
            { type: "declaration", property, value: gapMatch.value },
          ],
        });

        gapMatch.value = "0px";
      }
    });
  }
};

module.exports = function (source) {
  const options = this.getOptions();
  let result = source;

  if (source.includes("gap:")) {
    const JSStyles = CSS.parse(source);
    parseChildren(JSStyles);
    result = CSS.stringify(JSStyles, options);
  }

  return result;
};
