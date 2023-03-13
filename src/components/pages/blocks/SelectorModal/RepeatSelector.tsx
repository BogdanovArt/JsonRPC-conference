import clsx from "clsx";

import { onChange } from "components/common/Inputs/types";
import { NumberInput } from "components/common/Inputs/NumberInput";
import { FormKeys } from "components/pages/blocks/TemplateModal/enums";
import { DaysGroup } from "components/common/Inputs/DaysCheck";

import styles from "./RepeatSelector.module.scss";
import { Portal } from "@oktell/header-panel";
import { Button } from "components/common/UI/Button";
import { useState } from "react";
import { copy } from "utils/copy";

export interface RepeatPayload {
  repeat?: Repeat;
  repeat_count?: number;
}

interface Repeat {
  days?: number[];
  mode?: number;
}

interface Props {
  name: string;
  repeat?: Repeat;
  repeat_count?: number;
  returnValue?: onChange<RepeatPayload>;
}

export const RepeatSelector: React.FC<Props> = ({
  name,
  repeat,
  repeat_count,
  returnValue,
}) => {
  const [pl, setPl] = useState<RepeatPayload>({ repeat, repeat_count });

  const inputHandler = (inputName: string, value?: number[] | number) => {
    const payload = copy(pl);
    switch (inputName) {
      case FormKeys.days:
        payload.repeat.days = value as number[];
        payload.repeat.mode = payload.repeat.mode || 2;
        break;
      case FormKeys.mode:
        payload.repeat.mode = (value as number) + 1;
        break;
      case FormKeys.repeatCount:
        payload.repeat_count = value as number;
        break;
      default:
        break;
    }
    setPl(payload);
  };

  const saveHandler = () => {
    returnValue(name, pl);
  };

  return (
    <div className={styles.Wrapper}>
      <DaysGroup
        name={FormKeys.days}
        initial={repeat?.days || []}
        onChange={inputHandler}
        style={{ justifyContent: "space-between" }}
      />

      <div className={styles.CountRepeat}>
        <span>Каждую</span>
        <NumberInput
          name={FormKeys.mode}
          step={1}
          initial={repeat?.mode || 1}
          max={2}
          min={1}
          onChange={inputHandler}
        />
        <span>неделю</span>
      </div>

      <div className={clsx(styles.CountRepeat, styles.CountRepeatWide)}>
        <span> Количество повторов</span>
        <NumberInput
          name={FormKeys.repeatCount}
          step={1}
          initial={repeat_count || 1}
          max={99}
          min={1}
          onChange={inputHandler}
        />
      </div>

      <Portal id="repeat-portal">
        <Button dark onClick={saveHandler}>
          Готово
        </Button>
      </Portal>
    </div>
  );
};
