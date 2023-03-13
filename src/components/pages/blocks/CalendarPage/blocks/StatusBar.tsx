import { Icon, IconName } from "@oktell/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { StatusTimeButton } from "./StatusTimeButton";
import { StatusButton } from "./StatusButton";

import { ActionHandler } from "../../SelectorPage/types";
import { Keys, ToastContent } from "./types";

import styles from "./StatusBar.module.scss";

let timer: NodeJS.Timer = null;
const Toasts: { [key in Keys]?: ToastContent[] } = {
  dynamic: [
    { text: "Динамик участников включен", icon: "dynamic" },
    { text: "Динамик участников выключен", icon: "nodynamic" },
  ],
  mic: [
    { text: "Микрофон участников включен", icon: "mic" },
    { text: "Микрофон участников выключен", icon: "nomic" },
  ],
  recall: [
    { text: "Перезваниваем при недозвоне", icon: "call" },
    { text: "Не перезваниваем", icon: "decline" },
  ],
};

interface Props {
  initialValues?: { [key in Keys]: boolean | number };
  hideItems?: Keys[];
  disableItems?: Keys[];
  actionHandler?: ActionHandler;
}

export const StatusBar: React.FC<Props> = ({
  initialValues = { calltime: 30 },
  actionHandler,
  hideItems = [],
  disableItems = [],
}) => {
  const [toast, setToast] = useState<ToastContent | null>(null);
  const [showToast, setShowToast] = useState(false);

  const changeHandler = async (
    action: Keys,
    value: { [key in Keys]: boolean | number }
  ) => {
    clearTimeout(timer);

    const toastContent = Toasts[action];
    const toastState = !!value[action];

    if (toastContent) {
      setToast(toastState ? toastContent[0] : toastContent[1]);
      setShowToast(true);
    }

    actionHandler("selector_call_settings", value);

    timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Buttons}>
        {!hideItems.includes("dynamic") ? (
          <StatusButton
            name="dynamic"
            icons={["dynamic", "nodynamic"]}
            disabled={disableItems?.includes("dynamic")}
            initial={initialValues.dynamic as boolean}
            tooltips={["Динамик выключен", "Динамик включен"]}
            actionHanlder={changeHandler}
          />
        ) : null}

        {!hideItems.includes("mic") ? (
          <StatusButton
            name="mic"
            initial={initialValues.mic as boolean}
            icons={["mic", "nomic"]}
            disabled={disableItems?.includes("mic")}
            tooltips={["Микрофон выключен", "Микрофон включен"]}
            actionHanlder={changeHandler}
          />
        ) : null}
        {!hideItems.includes("recall") ? (
          <StatusButton
            name="recall"
            initial={initialValues.recall as boolean}
            icons={["call", "decline"]}
            disabled={disableItems?.includes("recall")}
            tooltips={[
              "Не перезвоним, если участник не присоединился к селектору",
              "Перезвоним, если участник не присоединился к селектору",
            ]}
            actionHanlder={changeHandler}
          />
        ) : null}
        {!hideItems.includes("calltime") ? (
          <StatusTimeButton
            name="calltime"
            initial={initialValues.calltime as number}
            disabled={disableItems?.includes("calltime")}
            tooltips={["Продолжительность звонка", ""]}
            actionHanlder={changeHandler}
          />
        ) : null}
      </div>
      <div id="toast">
        <div
          className={clsx(styles.Toast, { [styles.ToastActive]: showToast })}
        >
          <Icon name={toast?.icon as IconName} className="icon" />
          <span>{toast?.text}</span>
        </div>
      </div>
    </div>
  );
};
