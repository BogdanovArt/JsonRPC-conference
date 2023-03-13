import { useState, useRef } from "react";
import { Popover } from "@material-ui/core";
import clsx from "clsx";

import styles from "./PopUpList.module.scss";

interface Items {
  [key: string]: string;
}

interface Props<T> {
  children?: JSX.Element | JSX.Element[];
  items: T;
  onClick: (key: string) => void;
}

export const PopUpList = ({
  children,
  items = {},
  onClick = () => null,
}: Props<Items>) => {
  const [show, setShow] = useState(false);
  const anchor = useRef(null);

  const clickHandler = (key: string) => {
    setShow(false);
    onClick(key);
  };

  return (
    <div ref={anchor} className={styles.Wrapper}>
      <div className={styles.Toggler} onClick={() => setShow(true)}>
        {children}
      </div>

      <Popover
        open={show}
        anchorEl={anchor.current}
        container={anchor.current}
        PaperProps={{ className: styles.Pop }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setShow(false)}
      >
        <div className={clsx(styles.List, "PopUpList")}>
          {Object.entries(items).map(([key, title], ind) => (
            <div
              key={key}
              className={clsx(styles.ListItem, `ListItem-${key}`, "ListItem")}
              onClick={() => clickHandler(key)}
            >
              {title}
            </div>
          ))}
        </div>
      </Popover>
    </div>
  );
};
