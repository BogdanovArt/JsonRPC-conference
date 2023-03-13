import { Icon } from "@oktell/icons";

import { ActionHandler, CallUser } from "../types";

import styles from "./UserMenu.module.scss";

interface Props {
  user: CallUser;
  actionHandler?: ActionHandler;
}

export const MicControl: React.FC<Props> = ({
  actionHandler = () => null,
  user,
}) => {
  return (
    <>
      <div
        className={styles.MenuItem}
        onClick={() =>
          actionHandler("controls", {
            id: user.id,
            button: "mic",
          })
        }
      >
        <div>{user.mic ? <Icon name="nomic" /> : <Icon name="mic" />}</div>
        <div>{user.mic ? "Выключить микрофон" : "Включить микрофон"}</div>
      </div>
    </>
  );
};
