import Slide from "@material-ui/core/Slide";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { getBreakPoint } from "store/core/getters";
import { MobileHeaderProps, MobileModalHeader } from "../MobileHeader";
import { ScrollContainer } from "components/common/UI/ScrollContainer";

import { IBasicObject } from "types/index";
import { ModalStyles } from "../../consts";

import styles from "./Slide.module.scss";

export interface Props extends MobileHeaderProps {
  show?: boolean;
  title?: string;
  footer?: JSX.Element | JSX.Element[];
  onClose?: () => void;
  onConfirm?: (data: IBasicObject) => void;
}

export const MobileSlideModal: React.FC<Props> = ({
  show,
  title,
  children,
  footer,
  onClose = () => null,
  onConfirm = () => null,
  ...rest
}) => {
  const breakpoint = useSelector(getBreakPoint);

  return (
    <Slide
      direction="left"
      in={show}
      style={{
        ...ModalStyles[breakpoint],
      }}
    >
      <div
        className={clsx(styles.Slide, styles[`SelectorModal-${breakpoint}`])}
      >
        <MobileModalHeader {...rest}>
          <div>{title}</div>
        </MobileModalHeader>
        <ScrollContainer className={styles[`SelectorModal-${breakpoint}-Content`]}>
          {children}
        </ScrollContainer>
        {footer ? (
          <div className={clsx(styles.SlideFooter, styles.Padding)}>{footer}</div>
        ) : null}
      </div>
    </Slide>
  );
};
