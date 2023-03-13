import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import { useSelector } from "react-redux";

import { getLayoutStructure } from "../Layout/helpers";
import { UserCardEmpty, UsersLayout } from "../Layout/Layout";
import { CallUser } from "../Participants/CallUser";
import { UsersBar } from "../Participants/UserBar";

import { VideoUsersModal } from "components/pages/blocks/CalendarPage/blocks/VideoUsersModal";
import { Modal } from "components/common/Modal/Modal";

import { ActionHandler, CallUser as User } from "../types";

import { getBreakPoint } from "store/core/getters";

import styles from "./UsersGrid.module.scss";

interface Props {
  nobar?: boolean;
  users?: User[];
  actionHandler?: ActionHandler;
  isVideo?: boolean;
  videoMode?: string;
  selectorId?: string;
  showControlPanel?: () => void;
}

export const UsersGrid: React.FC<Props> = ({
  nobar,
  users,
  actionHandler = () => null,
  isVideo = false,
  videoMode,
  selectorId,
  showControlPanel,
}) => {
  const videoModeReplace = videoMode?.replace("-fhd", "");
  const videoCellArray = videoModeReplace?.split("x").map(Number);
  const videoCellCount = videoCellArray?.reduce((acc, rec) => acc * rec);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [cellCount, setCellCount] = useState(0);
  const rUserId = localStorage.getItem("rUserId");

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  const onCloseModal = () => {
    setShowUsersModal(false);
  };

  const onOpenModal = (count: number) => {
    setShowUsersModal(true);
    setCellCount(count);
  };

  const onClickHandler = (user: User) => {
    actionHandler("selector_change_video_cell", {
      selectorId: selectorId,
      rUserId,
      videoCell: cellCount,
      id: user.id,
    });

    setShowUsersModal(false);
  };

  const deleteUser = (user: User) => {
    if (isVideo) {
      actionHandler("selector_change_video_cell", {
        selectorId: selectorId,
        rUserId,
        videoCell: 0,
        id: user.id,
      });
    }
  };

  const structure = useMemo(() => {
    const cellType = isVideo
      ? getLayoutStructure(videoCellCount, isDesktop)
      : getLayoutStructure(users.length, isDesktop);
    return users?.length ? cellType : [];
  }, [users, isDesktop]);

  const renderUsers = () => {
    let count = 0;
    return structure.map((columns, row) => {
      return Array.from(Array(columns).keys()).map((x, index) => {
        count++;
        const filterVideoUser = users.filter(
          (item) => item.video_cell === count
        )[0];
        const videoUser = isVideo ? filterVideoUser : users[count - 1];
        const cellCount = count;
        return videoUser ? (
          <CallUser
            key={`${videoUser.id}-${count}`}
            user={videoUser}
            proportion={columns}
            onContextMenu={deleteUser}
            actionHandler={actionHandler}
          />
        ) : (
          <UserCardEmpty
            proportion={columns}
            className={clsx(styles[`UserItem-${breakpoint}`])}
          >
            <div
              className={styles.UserItemEmpty}
              onClick={() => onOpenModal(cellCount)}
            >
              <Icon name={"empty"} />
            </div>
          </UserCardEmpty>
        );
      });
    });
  };

  const usersBarVideo = useMemo(() => {
    return users.filter((item) => {
      return !item.video_cell || item.video_cell > videoCellCount;
    });
  }, [users]);

  const usersBarAudio = useMemo(() => {
    return users.slice(36);
  }, [users]);

  const isVideoUsers = isVideo ? usersBarVideo : usersBarAudio;

  return (
    <>
      <UsersLayout
        users={users?.length}
        className={clsx(styles.UsersBar, styles[`UsersBar-${breakpoint}`], {
          [styles.UsersBarHeight]: isVideoUsers.length,
        })}
        onTouchEnd={() => showControlPanel()}
      >
        {renderUsers()}
        {!nobar && isVideoUsers.length && isDesktop ? (
          <UsersBar users={isVideoUsers} actionHandler={actionHandler} />
        ) : null}
      </UsersLayout>
      <Modal
        show={showUsersModal}
        wide
        content={
          <div
            className={clsx(
              styles.ModalWrapper,
              styles[`ModalWrapper-${breakpoint}`]
            )}
          >
            <VideoUsersModal
              show={showUsersModal}
              users={users}
              hideArrow
              desktopHeader
              videoMode={videoMode}
              cellCount={cellCount}
              timeout={0}
              onClose={onCloseModal}
              actionHandler={onClickHandler}
            />
          </div>
        }
      />
    </>
  );
};
