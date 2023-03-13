import { HTMLAttributes } from "react";
import { Slide } from "@material-ui/core";
import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { MobileModalHeader } from "components/pages/blocks/CalendarPage/blocks/MobileHeader";
import { ScrollContainer } from "../UI/ScrollContainer";

import { getBreakPoint } from "store/core/getters";

import styles from "./SlideModal.module.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  show?: boolean;
  hideArrow?: boolean;
  desktopHeader?: boolean;
  timeout?: number;
  before?: JSX.Element;
  header?: JSX.Element;
  beforeContent?: JSX.Element;
  afterContent?: JSX.Element;
  className?: string;
  footer?: JSX.Element;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const SlideModal: React.FC<Props> = ({
  shadow,
  before,
  beforeContent,
  afterContent,
  show,
  onClose,
  onConfirm,
  header,
  footer,
  children,
  className,
  hideArrow,
  desktopHeader,
  timeout = 225,
  ...rest
}) => {
  const breakpoint = useSelector(getBreakPoint);

  const renderHeader = () => {
    return ["xs", "md"].includes(breakpoint) && !desktopHeader ? (
      <MobileModalHeader
        leftIconAction={onClose}
        rightIcon={onConfirm ? "check" : undefined}
        rightIconAction={onConfirm}
      >
        {header}
      </MobileModalHeader>
    ) : (
      <div className={clsx(styles.Header, styles.Padding)}>
        <Icon
          name="arrow"
          className={clsx(styles.BackButton, { [styles.Hide]: hideArrow })}
          onClick={onClose}
        />
        <div className={styles.HeaderContent}>{header}</div>
      </div>
    );
  };

  return (
    <Slide timeout={timeout} in={show} direction="left" style={{ zIndex: 3 }}>
      <div className={clsx(styles.Wrapper, className)} {...rest}>
        <div
          className={clsx(styles.Background, {
            [styles.Shadow]: shadow,
          })}
        >
          {before ? (
            <div className={styles.Padding} style={{ paddingBottom: 0 }}>
              {before}
            </div>
          ) : null}
          {renderHeader()}
          <div
            className={clsx(styles.Content, styles.Padding, "slide-content")}
          >
            {beforeContent}
            <ScrollContainer>{children}</ScrollContainer>
            {afterContent}
          </div>
          {footer ? (
            <div className={clsx(styles.Footer, styles.Padding)}>{footer}</div>
          ) : null}
        </div>
        <div className={styles.Underlay} />
      </div>
    </Slide>
  );
};
