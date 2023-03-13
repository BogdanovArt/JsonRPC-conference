import { Icon, IconName } from "@oktell/icons";
import clsx from "clsx";

import styles from "./MobileHeader.module.scss";

export interface MobileHeaderProps {
  leftIcon?: IconName | null;
  rightIcon?: IconName;
  rightIconAction?: () => void;
  leftIconAction?: () => void;
  rightSlot?: JSX.Element | JSX.Element[];
  leftSlot?: JSX.Element | JSX.Element[];
  className?: string;
}

export const MobileModalHeader: React.FC<MobileHeaderProps> = ({
  children,
  leftIcon = "close",
  rightIcon,
  rightIconAction = () => null,
  leftIconAction = () => null,
  rightSlot,
  leftSlot,
  className,
}) => {
  const renderRightControls = () => {
    if (!rightIcon && !rightSlot) return <div className={styles.HeaderDud} />;

    return (
      <>
        {rightIcon ? (
          <Icon
            name={rightIcon}
            onClick={rightIconAction}
            className={styles.HeaderIcon}
          />
        ) : null}
        {rightSlot || null}
      </>
    );
  };

  return (
    <div className={clsx(styles.Header, className)}>
      {leftSlot || null}

      {leftIcon ? (
        <Icon
          name={leftIcon}
          onClick={leftIconAction}
          className={styles.HeaderIcon}
        />
      ) : null}
      <div className={styles.HeaderContent}>{children}</div>

      {renderRightControls()}
    </div>
  );
};
