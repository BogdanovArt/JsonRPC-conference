import clsx from "clsx";

import { UserItemProps } from "./UserItem";
import { DefaultUserItem } from "./DefaultUserItem";

import { ActionHandler, CallUser } from "../../types";

import styles from "./Participants.module.scss";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";
import {isMobile, isTablet} from "react-device-detect";

interface Props {
  selectorId?: string;
  users: CallUser[];
  UserComponent?: React.FC<UserItemProps>;
  actionHandler?: ActionHandler;
  emptyMessage?: string;
  hands?: boolean;
  isVideo?: boolean;
}

export const UserList: React.FC<Props> = ({
  selectorId,
  users,
  UserComponent = DefaultUserItem,
  actionHandler,
  emptyMessage,
  hands,
  isVideo,
}) => {
  const breakpoint = useSelector(getBreakPoint);
  const isTouchDevice = isMobile || isTablet;
  return (
    <>
      {users.length ? (
        users.map((user, index) => (
          <UserComponent
            selectorId={selectorId}
            key={index}
            user={user}
            actionHandler={actionHandler}
            hands={hands}
            isVideo={isVideo}
          />
        ))
      ) : emptyMessage ? (
        <div className={clsx(styles.Empty, styles[`Empty-${breakpoint}`], {[styles.EmptyTablet]: isTouchDevice})}>
          {emptyMessage}
        </div>
      ) : null}
    </>
  );
};
