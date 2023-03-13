import { Avatar } from "@oktell/header-panel";
import { Icon, IconName } from "@oktell/icons";
import clsx from "clsx";
import reactStringReplace from "react-string-replace";

import { RoleSelect } from "../../UserMenu/RoleSelect";
import { UserMenu } from "../../UserMenu/UserMenu";
import { UserRemove } from "../../UserMenu/UserRemove";

import { CornerPosition, roles } from "../../consts";
import {ActionHandler, CallUser, CallUserExt} from "../../types";

import styles from "./UserItem.module.scss";
import { IconWrap } from "components/pages/blocks/SelectorPage/Layout/Layout";

export interface UserItemProps {
  user: CallUser & CallUserExt;
  search?: string;
  videoIcon?: string;
  video?: boolean;
  disabled?: boolean;
  showActions?: boolean;
  actionHandler?: ActionHandler;
  showVideoModal?: () => void;
}

export const CompactUserItem: React.FC<UserItemProps> = ({
  user,
  search,
  video,
  videoIcon,
  disabled,
  showActions,
  showVideoModal,
  actionHandler,
}) => {
  const videoIconUser = (
    user?.video_cell ? `grid-${videoIcon}` : "empty"
  ) as IconName;
  const pathCount = user?.video_cell ? user.video_cell : 0;
  const clickHandler = (button: string) => {
    actionHandler(button, {
      id: user.id,
      button: button,
    })
  }
  return (
    <div className={clsx(styles.User, "user-compact")}>
      {video ? (
        <button
          className={clsx(styles.UserVideo, { [styles.Disabled]: disabled })}
          onClick={showVideoModal}
        >
          <IconWrap pathCount={pathCount}>
            <Icon name={videoIconUser} className={styles.UserVideoIcon} />
          </IconWrap>
        </button>
      ) : null}
      <Avatar size={24} name={user.name} />
      <div className={styles.UserName}>
        <span>
          {search
            ? reactStringReplace(user.name, search, (match, index) => (
                <span key={index} className={styles.UserSearchActive}>
                  {match}
                </span>
              ))
            : user.name}
        </span>
      </div>
      {showActions ? (
        <div className={styles.UserActionsWrap}>
          <div className={styles.Button} onClick={() => clickHandler("mic")}>
            <Icon name={user.mic ? "mic" : "nomic"} className={styles.Icon} />
          </div>
          {video ? (
            <div className={styles.Button} onClick={() => clickHandler("cam")}>
              <Icon name={user.video_out ? "cam" : "nocam"} className={styles.Icon} />
            </div>
          ) : null}
        </div>
      ) : null}
      {actionHandler ? (
        <UserMenu
          anchor={<Icon name="menudots" className={styles.Button} />}
          popoptions={CornerPosition}
        >
          <RoleSelect user={user} actionHandler={actionHandler} />
          <div className="divider" />
          <UserRemove user={user} actionHandler={actionHandler} />
        </UserMenu>
      ) : null}
    </div>
  );
};
