import { Icon } from "@oktell/icons";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./SelectorViewBar.module.scss";
import { RadioButton } from "components/common/Inputs/RadioButton";
import { FormKeys } from "components/pages/blocks/TemplateModal/enums";
import { ActionHandler } from "components/pages/blocks/SelectorPage/types";

interface Props {
  usersCount?: number;
  initial?: string;
  vertical?: boolean;
  selectorId?: string;
  readonlyView?: boolean;
  actionHandler?: ActionHandler;
  onChange?: (name: string, value?: unknown, checked?: unknown) => void;
}

export const SelectorViewBar: React.FC<Props> = ({
  usersCount,
  initial,
  vertical,
  selectorId,
  readonlyView,
  actionHandler,
  onChange,
}) => {
  const disabledGrid1 = false;
  const disabledGrid2x2 = usersCount < 2;
  const disabledGrid3x2 = usersCount < 5;
  const disabledGrid3x3 = usersCount < 7;
  const disabledGrid4x3 = usersCount < 10;
  const disabledGrid4x4 = usersCount < 13;
  const disabledGrid5x5 = usersCount < 17;
  const disabledGrid6x6 = usersCount < 26;

  const radioList = ["1", "2x2", "3x2", "3x3", "4x3", "4x4", "5x5", "6x6"];
  const radioListIcon = [
    "grid-1",
    "grid-2x2",
    "grid-2x3",
    "grid-3x3",
    "grid-2x3",
    "grid-4x4",
    "grid-5x5",
    "grid-5x5",
  ];
  const radioDisabledList = [
    disabledGrid1,
    disabledGrid2x2,
    disabledGrid3x2,
    disabledGrid3x3,
    disabledGrid4x3,
    disabledGrid4x4,
    disabledGrid5x5,
    disabledGrid6x6,
  ];
  const rUserId = localStorage.getItem("rUserId");

  const actionButton = (action: string, mode: string, disabled: boolean) => {
    if (!disabled && initial !== mode) {
      actionHandler(action, {
        selectorId: selectorId,
        rUserId,
        videoMode: mode,
      });
    }
  };

  // TODO: Исправить вывод иконок, когда будут отрисованы все правильные

  if (vertical) {
    return (
      <div>
        {radioList.map((item, index) => (
          <button
            key={index}
            className={clsx(styles.Button, {[styles.Disabled]: radioDisabledList[index], [styles.Active]: item === initial})}
            onClick={() => actionButton("selector_change_layout", item, radioDisabledList[index])}
          >
            <Icon name={radioListIcon[index]} />
            <span>{item}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.Wrapper}>
      {radioList.map((item, index) => (
        <RadioButton
          onChange={onChange}
          disabled={radioDisabledList[index]}
          key={index}
          icon
          iconView={radioListIcon[index]}
          label={item}
          value={item}
          name={FormKeys.videoMode}
          initial={initial === item}
          readonlyRadio={readonlyView}
        />
      ))}
    </div>
  );
};
