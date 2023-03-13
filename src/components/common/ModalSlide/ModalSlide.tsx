import React from "react";
import clsx from "clsx";

import { Icon } from "@oktell/icons";
import Slide from "@material-ui/core/Slide";

import styles from "./ModalSlide.module.scss";
import { ScrollContainer } from "../UI/ScrollContainer";

interface Props {
  show?: boolean;
  title?: string;
  content?: JSX.Element | null;
  onClose?: () => void;
  submodal?: boolean;
}

const SlideStyles: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  width: 440,
  maxHeight: "calc(100vh - 180px)",
  right: 0,
  zIndex: 4,
  background: "var(--bg-primary)",
};

export function ModalSlide({
  show,
  onClose = () => null,
  title = "",
  content = null,
  submodal = false,
}: Props) {
  if (submodal) {
    return show ? (
      <Slide direction="left" in={show} style={SlideStyles}>
        <div className={styles.Modal}>
          <div className={styles.ModalHeaderSubmodal}>
            <button className={styles.ModalActionClose} onClick={onClose}>
              <Icon
                name={"arrow"}
                className={clsx(styles.ModalIcon, styles.ModalIconArrow)}
              />
            </button>
            <div className={styles.ModalTitle}>{title}</div>
          </div>

          <div className={styles.ModalContent}>{content}</div>
        </div>
      </Slide>
    ) : null;
  }

  return show ? (
    <Slide direction="left" in={show} style={SlideStyles}>
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          <button className={styles.ModalActionClose} onClick={onClose}>
            <img src="svg/close.svg" alt="Close" />
          </button>
        </div>

        <div className={styles.ModalTitle}>{title}</div>

        <ScrollContainer className={styles.ModalContent}>
          {content}
        </ScrollContainer>
      </div>
    </Slide>
  ) : null;
}
