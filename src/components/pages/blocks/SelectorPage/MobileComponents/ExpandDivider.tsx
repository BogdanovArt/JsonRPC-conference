import { Icon } from "@oktell/icons";
import clsx from "clsx";

import styles from "./ExpandDivider.module.scss";

interface Props {
  show?: boolean;
  toggle?: () => void;
}

export const ExpandDivider: React.FC<Props> = ({
  show,
  toggle = () => null,
}) => {
  return (
    <div className={styles.Wrapper} onClick={toggle}>
      <div className={styles.Divider}></div>
      <button>
        <Icon
          name="chevron"
          className={clsx(styles.Icon, { [styles.Reverse]: show })}
        />
      </button>
      <div className={styles.Divider}></div>
    </div>
  );
};
