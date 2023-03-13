import { useEffect, useRef, useState } from "react";
import { Icon } from "@oktell/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { Popover } from "@material-ui/core";
import clsx from "clsx";

import { ScrollContainer } from "components/common/UI/ScrollContainer";

import { ButtonProps } from "./types";

import styles from "./StatusBar.module.scss";

interface Props extends ButtonProps<number> {}

const values = [5, 10, 15, 30, 45, 60, 90, 120, 180];

export const StatusTimeButton: React.FC<Props> = ({
  disabled,
  name,
  initial = 30,
  tooltips,
  actionHanlder = () => null,
}) => {
  const [callTime, setCallTime] = useState(initial);
  const [show, setShow] = useState(false);

  const anchor = useRef<HTMLDivElement>(null);

  const clickHandler = (value: number) => {
    setCallTime(value);
    setShow(false);
    actionHanlder(name, { [name]: value });
  };

  useEffect(() => {
    setCallTime(initial);
  }, [initial]);

  return (
    <>
      <Tooltip
        enterDelay={500}
        arrow
        title={tooltips?.[0]}
        classes={{ popper: styles.Tooltip }}
      >
        <div
          ref={anchor}
          className={clsx(styles.IconButton, { [styles.Disabled]: disabled })}
          onClick={() => setShow(true)}
        >
          <Icon name="phonedark" className="icon" />
          <span className={styles.Text}>{callTime} c</span>
        </div>
      </Tooltip>
      <Popover
        open={show}
        anchorEl={anchor.current}
        container={anchor.current}
        onClose={() => setShow(false)}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        className={styles.SelectListPopover}
        classes={{ paper: styles.SelectListBG }}
      >
        <div className={styles.SelectList}>
          <ScrollContainer>
            {values.map((value) => (
              <div
                key={value}
                className={styles.SelectListItem}
                onClick={() => clickHandler(value)}
              >
                <span>{value}</span>
                сек
              </div>
            ))}
          </ScrollContainer>
        </div>
      </Popover>
    </>
  );
};
