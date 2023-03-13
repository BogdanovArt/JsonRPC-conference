import clsx from "clsx";

import { ActionHandler, CallUser } from "../types";

import styles from "./UserMenu.module.scss";

interface Props {
  user: CallUser;
  actionHandler?: ActionHandler;
}

export const UserRemove: React.FC<Props> = ({
  actionHandler = () => null,
  user,
}) => {
  return (
    <>
      <div
        className={clsx(styles.MenuItem, styles.Remove)}
        onClick={() =>
          actionHandler("remove", {
            id: user.id,
            button: "remove",
          })
        }
      >
        <div></div>
        <div>Удалить</div>
      </div>
    </>
  );
};
