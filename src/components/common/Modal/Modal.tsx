import styles from "./Modal.module.scss";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

interface Props {
  show?: boolean;
  title?: string;
  content?: JSX.Element | null;
  onClose?: () => void;
  className?: string;
  contentClassName?: string;
  wide?: boolean;
}

export function Modal({
  show,
  onClose = () => null,
  title = "",
  content = null,
  wide,
  className,
  contentClassName,
}: Props) {
  const breakpoint = useSelector(getBreakPoint);

  return show ? (
    <div
      className={clsx(
        styles.Container,
        styles[`Container-${breakpoint}`],
        className
      )}
    >
      <div className={styles.Overlay} onClick={onClose}></div>
      <div
        className={clsx(
          styles.Content,
          contentClassName,
          styles[`Content-${breakpoint}`],
          {
            [styles.ContentWide]: wide,
          }
        )}
      >
        <div className={styles.Header}>
          <div className={clsx(styles.Title, "ContentTitle")}>{title}</div>
          <div className={styles.Close} onClick={onClose}>
            <Icon name="close" />
          </div>
        </div>
        {content}
      </div>
    </div>
  ) : null;
}
