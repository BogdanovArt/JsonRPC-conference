import { Avatar } from "@oktell/header-panel";
import { Icon } from "@oktell/icons";
import {isMobile, isTablet} from "react-device-detect";
import clsx from "clsx";

import { MicControl } from "../../UserMenu/MicControl";
import { RoleSelect } from "../../UserMenu/RoleSelect";
import { UserMenu } from "../../UserMenu/UserMenu";
import { UserRemove } from "../../UserMenu/UserRemove";

import { CornerPosition, roles } from "../../consts";
import { ActionHandler, CallUser, CallUserExt } from "../../types";

import styles from "./UserItem.module.scss";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

const renderUserRole = (user: CallUser) => {
  if (user.topology_type === "listener") return "";
  return `(${roles[user.topology_type]?.title})`;
};

export interface UserItemProps {
  selectorId?: string;
  user: CallUser & CallUserExt;
  actionHandler?: ActionHandler;
  hands?: boolean;
  isVideo?: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({
  selectorId,
  user,
  actionHandler,
  hands,
  isVideo,
}) => {
  const rUserId = localStorage.getItem("rUserId");
  const breakpoint = useSelector(getBreakPoint);
  const isTouchDevice = isMobile || isTablet;
  const actionButton = (button: string) => {
    actionHandler("participant_mic_update", {
      participant_id: user.id,
      selectorId,
      button,
      rUserId,
    });
  };
  return (
    <div
      className={clsx(styles.User, styles[`User-${breakpoint}`], {[styles.UserTablet]: isTouchDevice}, "user-item")}
    >
      <Avatar size={24} name={user.name} />
      <div className={styles.UserName}>
        <span>{user.name}</span>
        <span className={styles.UserRole}>{renderUserRole(user)}</span>
      </div>
      <div className={clsx(styles.UserActionsWrap)}>
        {user.is_hand_raised ? (
          <Icon
            name="handfilled"
            className={clsx("icon--hand", { [styles.UserActionsOrder]: hands })}
          />
        ) : null}

        <div
          className={clsx(styles.Button, "readonly")}
          onClick={() => actionButton("mic")}
        >
          {user.mic ? (
            <Icon name="mic" />
          ) : (
            <Icon name="nomic" className={styles.Dimmed} />
          )}
        </div>

        {isVideo ? (
          <div
            className={clsx(styles.Button, "readonly")}
            onClick={() => actionButton("video_out")}
          >
            {user.video_out ? (
              <Icon name="cam" className={styles.Icon} />
            ) : (
              <Icon name="nocam" className={clsx(styles.Dimmed, styles.Icon)} />
            )}
          </div>
        ) : null}
      </div>
      <UserMenu
        anchor={<Icon name="menudots" className={styles.Button} />}
        popoptions={CornerPosition}
      >
        <RoleSelect user={user} actionHandler={actionHandler} />
        <div className="divider" />
        <MicControl user={user} actionHandler={actionHandler} />
        <div className="divider" />
        <UserRemove user={user} actionHandler={actionHandler} />
      </UserMenu>
    </div>
  );
};
