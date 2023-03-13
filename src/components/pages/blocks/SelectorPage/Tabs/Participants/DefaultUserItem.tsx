import { Avatar } from "@oktell/header-panel";
import clsx from "clsx";

import { ActionHandler, CallUser } from "../../types";

import styles from "./UserItem.module.scss";

export interface UserItemProps {
  selectorId?: string;
  user: CallUser;
  actionHandler?: ActionHandler;
  hands?: boolean;
  isVideo?: boolean;
}

export const DefaultUserItem: React.FC<UserItemProps> = ({ user }) => {
  return (
    <div className={clsx(styles.User, "user-default")}>
      <Avatar size={24} name={user.name} />
      <div className={styles.UserName}>
        <span>{user.name}</span>
      </div>
    </div>
  );
};
