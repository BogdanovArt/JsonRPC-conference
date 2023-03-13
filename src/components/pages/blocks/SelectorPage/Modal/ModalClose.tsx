import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { IconButton } from "components/common/UI/IconButton";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Overrides } from "./Overrides";
import styles from "./ModalClose.module.scss";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

const styleOverrides = makeStyles(Overrides);

interface Props {
  time?: number;
  exit?: () => void;
  onClose?: () => void;
}

export const ModalClose: React.FC<Props> = ({ time = 10, exit, onClose }) => {
  const [timerCount, setTimer] = useState(time);
  const classes = styleOverrides();
  const progress = (100 / time) * (time - timerCount);
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timerCount) {
      exit();
    }
  }, [timerCount]);

  return (
    <div className={clsx(styles.Container, styles[`Container-${breakpoint}`])}>
      <div className={styles.Overlay}></div>
      <div className={styles.Content}>
        <div className={clsx(styles.TimerWrap, classes.Wrapper)}>
          <CircularProgress
            color={"inherit"}
            thickness={1.5}
            variant="determinate"
            value={progress}
            size={230}
          />

          <div className={styles.TimerInfo}>
            <div className={styles.Count}>{timerCount}'</div>
            <div className={styles.Subtitle}>Селектор завершается...</div>
          </div>
        </div>
        <IconButton
          dark
          color="var(--accent-color)"
          className={clsx(styles.Button, styles.ButtonMobileText)}
          textMobile
          onClick={() => onClose()}
        >
          Остаться
        </IconButton>
        <IconButton
          dark
          color="var(--warning)"
          className={clsx(styles.Button, styles.ButtonMobileText)}
          textMobile
          onClick={() => exit()}
        >
          Выйти
        </IconButton>
      </div>
    </div>
  );
};
