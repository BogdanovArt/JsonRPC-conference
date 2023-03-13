import clsx from "clsx";
import { Avatar } from "@oktell/header-panel";
import { Icon } from "@oktell/icons";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

import { UserCard } from "../Layout/Layout";
import { UserMenu } from "../UserMenu/UserMenu";
import { RoleSelect } from "../UserMenu/RoleSelect";
import { MicControl } from "../UserMenu/MicControl";
import { UserRemove } from "../UserMenu/UserRemove";

import { CornerPosition } from "../consts";

import { ActionHandler, CallUser as User, CallUserExt } from "../types";

import styles from "./CallUser.module.scss";
import { UserStatus } from "components/pages/blocks/SelectorPage/Participants/UserStatus";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

interface UserProps {
  user: User & CallUserExt;
  proportion?: number;
  onContextMenu?: (user: User) => void;
  actionHandler?: ActionHandler;
}

export const CallUserCompact: React.FC<UserProps> = ({
  user,
  actionHandler,
}) => {
  const status = useMemo(() => {
    if (user.is_hand_raised) {
      return "hand";
    } else if (user.state === "calling" || user.state === "retry") {
      return "calling";
    } else if (user.hold) {
      return "pause";
    }

    return "";
  }, [user]);
  return (
    <div>
      <Tooltip
        enterDelay={500}
        arrow
        title={
          <div className={styles.Tooltip}>
            <div className={styles.TooltipText}>{user.name}</div>
            <UserStatus user={user} />
            {user.state === "off" ? (
              <div className={styles.TooltipText}>Контакт офлайн</div>
            ) : null}
          </div>
        }
      >
        <div>
          <UserMenu
            anchor={
              <div
                className={clsx(styles.AvatarTooltipWrap, {
                  [styles.Off]: user.state === "off",
                })}
              >
                {status ? (
                  <div
                    className={clsx(styles.AvatarStatus, {
                      [styles.Pause]: status === "pause",
                      [styles.Hand]: status === "hand",
                    })}
                  >
                    <Icon className={styles.AvatarIcon} name={status} />
                  </div>
                ) : null}
                <Avatar size={40} name={user.name} />
              </div>
            }
          >
            <RoleSelect user={user} actionHandler={actionHandler} />
            <div className="divider" />
            <MicControl user={user} actionHandler={actionHandler} />
            <div className="divider" />
            <UserRemove user={user} actionHandler={actionHandler} />
          </UserMenu>
        </div>
      </Tooltip>
    </div>
  );
};

export const CallUser: React.FC<UserProps> = ({
  user,
  proportion,
  onContextMenu,
  actionHandler,
}) => {
  const breakpoint = useSelector(getBreakPoint);
  const buttonHandler = (button: string) => {
    actionHandler("controls", {
      id: user.id,
      button,
    });
  };
  return (
    <UserCard
      proportion={proportion}
      className={clsx(styles[`CallUser-${breakpoint}`])}
    >
      <div className={clsx(styles.Controls)}>
        {user.is_hand_raised ? (
          <span>
            <Icon
              name="handfilled"
              className={clsx(styles.Icon, "icon--hand")}
            />
          </span>
        ) : null}
        <span className={styles.Expander} />
        <span onClick={() => buttonHandler("mic")}>
          {user.mic ? (
            <Icon name="mic" className={clsx(styles.Icon)} />
          ) : (
            <Icon name="nomic" className={clsx(styles.Icon)} />
          )}
        </span>
        <UserMenu
          anchor={
            <span>
              <Icon name="menudots" className={styles.Icon} />
            </span>
          }
          popoptions={CornerPosition}
        >
          <RoleSelect user={user} actionHandler={actionHandler} />
          <div className="divider" />
          <MicControl user={user} actionHandler={actionHandler} />
          <div className="divider" />
          <UserRemove user={user} actionHandler={actionHandler} />
        </UserMenu>
      </div>
      <div
        className={styles.AvatarWrap}
        onContextMenu={(event) => {
          event.preventDefault();
          onContextMenu(user);
        }}
      >
        <div className={clsx({ [styles.AvatarOff]: user.state === "off" })}>
          <Avatar size={60} name={user.name} />
        </div>
        <UserStatus user={user} absolute />
        {user.name}
      </div>
    </UserCard>
  );
};
