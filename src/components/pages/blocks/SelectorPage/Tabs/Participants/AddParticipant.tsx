import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { SlideModal } from "components/common/Modal/SlideModal";
import { Button } from "components/common/UI/Button";
import { Input } from "components/common/Inputs/Input";
import { AddButton } from "./AddButton";

import { defaultParticipant } from "utils/consts";
import { ActionHandler } from "../../types";

import { getBreakPoint } from "store/core/getters";

import styles from "./AddParticipant.module.scss";
import { isMobile, isTablet } from "react-device-detect";

interface Props {
  shadow?: boolean;
  hideAddButton?: boolean;
  showModal?: boolean;
  iconSize?: number;
  absoluteAddButton?: boolean;
  onAdd?: ActionHandler;
  onClose?: () => void;
}

export const AddParticipant: React.FC<Props> = ({
  shadow,
  hideAddButton,
  showModal,
  iconSize = 32,
  absoluteAddButton,
  onAdd = () => null,
  onClose,
}) => {
  const [addModal, setAddModal] = useState(false);
  const [number, setNumber] = useState("");
  const [displayname, setDisplayname] = useState("");

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const closeAddModal = () => {
    setAddModal(false);
    onClose();
  };

  useEffect(() => {
    setAddModal(showModal);
  }, [showModal]);

  const inputHandler = (name: string, value: string) => {
    switch (name) {
      case "number":
        setNumber(value);
        break;
      case "displayname":
        setDisplayname(value);
        break;
      default:
        break;
    }
  };

  const submit = () => {
    if (!number) return;

    const participant = { ...defaultParticipant };
    participant.number = number;
    participant.name = displayname || number;

    onAdd("add", { participant });

    closeAddModal();
    setNumber("");
    setDisplayname("");
  };

  return (
    <div className={clsx(styles.Wrapper)}>
      {!hideAddButton ? (
        <div
          className={clsx({
            [styles.AddButton]: isTouchDevice && absoluteAddButton && isDesktop,
          })}
        >
          <AddButton size={iconSize} onClick={() => setAddModal(true)} />
        </div>
      ) : null}
      <SlideModal
        shadow={shadow}
        header={
          <div className={styles.Header}>
            Добавить участника{" "}
            <span>
              <span className="required">*</span> обязательные поля
            </span>
          </div>
        }
        footer={
          isDesktop ? (
            <>
              <Button className={styles.Button} onClick={() => closeAddModal()}>
                Отмена
              </Button>
              <Button dark onClick={submit} disabled={!number}>
                Добавить
              </Button>
            </>
          ) : null
        }
        show={addModal}
        onClose={() => closeAddModal()}
        onConfirm={submit}
        className={clsx(styles.AddModal, styles[`AddModal-${breakpoint}`])}
      >
        <div className={styles.Form}>
          <div className={styles.FormBlock}>
            <label htmlFor="displayname">Имя</label>
            <Input
              placeholder="ФИО"
              name="displayname"
              initial={displayname}
              onChange={inputHandler}
            />
          </div>
          <div className={styles.FormBlock}>
            <label htmlFor="number">
              Номер <span className="required">*</span>
            </label>
            <div className={styles.FormRow}>
              <Input
                initial={number}
                placeholder="Номер"
                name="number"
                onChange={inputHandler}
                onEnter={submit}
              />
              <div className={styles.FormHint}>
                внутренний номер или мобильный телефон
              </div>
            </div>
          </div>
        </div>
      </SlideModal>
    </div>
  );
};
