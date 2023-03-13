import { Icon } from "@oktell/icons";
import clsx from "clsx";

import { Swipeable } from "components/common/UI/Swipeable";
import { useEffect, useRef, useState } from "react";

import styles from "./CancelToast.module.scss";

interface Props {
  show: boolean;
  title?: string;
  timeout?: number;
  onCancel?: () => void;
  onClose?: () => void;
}

export const CancelToast: React.FC<Props> = ({
  show,
  title,
  timeout = 10,
  onCancel = () => null,
  onClose = () => null,
  children,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timer>(null);
  const [countDown, setCountDown] = useState(0);

  const countRef = useRef(countDown);
  countRef.current = countDown;

  const resetTimer = () => {
    clearTimeout(timer);
    setTimer(null);
  };

  useEffect(() => {
    clearTimeout(timer);
    if (title) {
      setCountDown(timeout);
    } else {
      setCountDown(0);
    }
  }, [title]);

  useEffect(() => {
    if (countRef.current && countRef.current > 0) {
      setTimeout(() => {
        setCountDown(countRef.current - 1);
      }, 1000);
    } else {
      resetTimer();
      onClose();
    }
  }, [countDown]);

  return (
    <div
      className={clsx(
        styles.Wrapper,
        show ? styles.WrapperActive : styles.WrapperHidden,
        "ToastWrapper"
      )}
    >
      <Swipeable
        refresh={title}
        after={<div className={styles.Spacer}></div>}
        before={<div className={styles.Spacer}></div>}
        onSwipeLeft={onClose}
        onSwipeRight={onClose}
      >
        <div className={styles.Toast}>
          <Icon name="warning" className={styles.Icon} />
          <span className={styles.Title}>{title || children}</span>
          <span className={styles.Button} onClick={onCancel}>
            Отменить {countDown ? `(${countDown})` : null}
          </span>
        </div>
      </Swipeable>
    </div>
  );
};
