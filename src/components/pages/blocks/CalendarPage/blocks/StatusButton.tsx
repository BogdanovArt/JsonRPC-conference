import { useState } from "react";
import { Icon, IconName } from "@oktell/icons";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";

import { ButtonProps } from "./types";

import styles from "./StatusBar.module.scss";

interface Props extends ButtonProps {
  icons: [IconName, IconName];
}

export const StatusButton: React.FC<Props> = ({
  name,
  initial,
  icons,
  disabled,
  tooltips,
  actionHanlder = () => null,
}) => {
  const [state, setState] = useState(initial);

  const clickHandler = () => {
    setState(!state);
    actionHanlder(name, { [name]: !state });
  };

  return (
    <>
      <Tooltip
        enterDelay={500}
        arrow
        title={state ? tooltips?.[0] : tooltips?.[1]}
      >
        <div
          className={clsx(styles.IconButton, {
            [styles.Dimmed]: !state,
            [styles.Disabled]: disabled,
          })}
          onClick={clickHandler}
        >
          <Icon name={state ? icons[0] : icons[1]} className="icon" />
        </div>
      </Tooltip>
    </>
  );
};
