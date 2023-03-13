import { useEffect, useMemo, useRef } from "react";
import { CalendarViews } from "types/enums";

import { ViewTypes } from "../consts";

import styles from "./ViewToggler.module.scss";

const getID = (key: string) => {
  return `${key}-button`;
};

interface Props {
  views: typeof ViewTypes;
  active: CalendarViews;
  actionHandler?: (view: CalendarViews) => void;
}

export const ViewToggler: React.FC<Props> = ({
  views,
  active,
  actionHandler,
}) => {
  const chip = useRef<HTMLDivElement>(null);

  const setChipPosition = (key: CalendarViews) => {
    let accumulatedChars = 0;
    let accumulatedPadding = 0;

    for (let i = 0; i < ViewTypes.length; i++) {
      const type = ViewTypes[i];
      if (type.key !== key) {
        accumulatedChars += type.title.length;
        accumulatedPadding += 32;
      } else {
        chip.current.style.left = `calc(${accumulatedChars}ch + ${accumulatedPadding}px)`;
        chip.current.style.width = `calc(${type.title.length}ch + 32px)`;
        break;
      }
    }
  };

  useEffect(() => {
    setChipPosition(active);
  }, [active]);

  return (
    <div className={styles.Wrapper}>
      {views.map((view) => (
        <div
          key={view.key}
          className={styles.Item}
          onClick={() => actionHandler(view.key)}
        >
          {view.title}
        </div>
      ))}
      <div ref={chip} className={styles.Chip} />
    </div>
  );
};
