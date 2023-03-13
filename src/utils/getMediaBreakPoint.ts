import { isMobile, isTablet } from "react-device-detect";
import { BreakPoints, BreakPointValues } from "types/enums";
import { Orientation } from "./types";

export const getMediaBreakPoint = (): BreakPoints => {
  const isTouchDevice = isMobile || isTablet;
  const width = isTouchDevice ? window.screen.width : window.innerWidth;
  const height = isTouchDevice ? window.screen.height : window.innerHeight;

  let orientation: Orientation = "landscape";
  if (width < height) orientation = "portrait";

  const forceMobileLayout = orientation === "portrait" && isTablet;

  switch (true) {
    case width < BreakPointValues.xs:
      return "xs";
    case width < BreakPointValues.md:
      return "md";
    case width < BreakPointValues.lg:
      return forceMobileLayout ? "md" : "lg";
    default:
      return forceMobileLayout ? "md" : "xl";
  }
};
