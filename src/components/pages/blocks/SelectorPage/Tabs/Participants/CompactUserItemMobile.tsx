import { useMemo, useState } from "react";
import { Avatar } from "@oktell/header-panel";
import { Icon, IconName } from "@oktell/icons";
import clsx from "clsx";
import reactStringReplace from "react-string-replace";

import { Swipeable } from "components/common/UI/Swipeable";
import { IconWrap } from "components/pages/blocks/SelectorPage/Layout/Layout";
import { MobileSlideModal } from "components/pages/blocks/CalendarPage/blocks/CalendarModal/MobileSlideModal";

import { roles } from "../../consts";
import { ActionHandler, CallUser, Topology } from "../../types";
import { IBasicObject } from "types/index";

import styles from "./UserItem.module.scss";

export interface UserItemProps {
  readonly?: boolean;
  user: CallUser;
  search?: string;
  videoIcon?: string;
  video?: boolean;
  disabled?: boolean;
  actionHandler?: ActionHandler;
  showVideoModal?: () => void;
}

export const CompactUserItemMobile: React.FC<UserItemProps> = ({
  readonly,
  user,
  search,
  video,
  videoIcon,
  disabled,
  showVideoModal,
  actionHandler = () => null,
}) => {
  const [showModal, setShowModal] = useState(false);

  const videoIconUser = (
    user?.video_cell ? `grid-${videoIcon}` : "empty"
  ) as IconName;
  const pathCount = user?.video_cell ? user.video_cell : 0;

  const removeAction = () => {
    actionHandler("remove", {
      id: user.id,
      button: "remove",
      user,
    });
  };

  const highlightedName = useMemo(() => {
    return search
      ? reactStringReplace(user.name, search, (match, index) => (
          <span key={index} className={styles.UserSearchActive}>
            {match}
          </span>
        ))
      : user.name;
  }, [search, user]);

  return (
    <div className={clsx(styles.MobUser, "user-compact")}>
      <Swipeable
        disabled={readonly}
        swipeAway
        before={<div className={styles.Spacer}></div>}
        after={<div className={styles.Spacer}></div>}
        onSwipeLeft={removeAction}
        onSwipeRight={removeAction}
      >
        <div className={styles.User}>
          {video ? (
            <button
              className={clsx(styles.UserVideo, {
                [styles.Disabled]: disabled,
              })}
              onClick={showVideoModal}
            >
              <IconWrap pathCount={pathCount}>
                <Icon name={videoIconUser} className={styles.UserVideoIcon} />
              </IconWrap>
            </button>
          ) : null}

          <Avatar size={24} name={user.name} />

          <div className={styles.UserName}>
            <span>{highlightedName}</span>
          </div>
          {!readonly ? (
            <Icon
              name="chevron"
              style={{ transform: "rotate(90deg)" }}
              className={styles.MobUserIcon}
              onClick={() => setShowModal(true)}
            />
          ) : null}
        </div>
      </Swipeable>

      <MobileSlideModal
        title={user.name}
        show={showModal}
        leftIconAction={() => setShowModal(false)}
        rightIcon={"check"}
        rightIconAction={() => setShowModal(false)}
        footer={
          <div
            className={clsx(styles.MobUserButton, styles.MobUserButtonRemove)}
            onClick={removeAction}
          >
            <div>Удалить из селектора</div>
          </div>
        }
      >
        <div className={styles.MobUserRoles}>
          {Object.entries(roles).map(
            ([key, role]: [Topology, IBasicObject]) => (
              <div
                key={key}
                className={styles.MobUserItem}
                onClick={() =>
                  actionHandler("topology_type", {
                    id: user.id,
                    type: key,
                  })
                }
              >
                <div>
                  {key === user.topology_type ? (
                    <Icon
                      name="check"
                      style={{ transform: `scale(0.75, 1)` }}
                      className={clsx(styles.IconSuccess, styles.Icon)}
                    />
                  ) : null}
                </div>
                <div>{role.title}</div>
              </div>
            )
          )}
        </div>
      </MobileSlideModal>
    </div>
  );
};
