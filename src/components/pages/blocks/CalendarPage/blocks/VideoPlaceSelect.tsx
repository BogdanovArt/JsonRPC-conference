import styles from "./VideoPlaceSelect.module.scss";
import { getLayoutStructure } from "components/pages/blocks/SelectorPage/Layout/helpers";
import { CallUser as User } from "components/pages/blocks/SelectorPage/types";
import { VideoCellCard } from "components/pages/blocks/SelectorPage/Layout/Layout";
import { Icon } from "@oktell/icons";
import React, { useMemo, useState } from "react";
import { Avatar } from "@oktell/header-panel";
import clsx from "clsx";
import { Button } from "components/common/UI/Button";
import { VideoUsersModal } from "components/pages/blocks/CalendarPage/blocks/VideoUsersModal";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

interface Props {
  users?: User[];
  videoMode?: string;
  saveItems?: (users: User[]) => void;
  onClose?: () => void;
}

export const VideoPlaceSelect: React.FC<Props> = ({
  users,
  videoMode,
  saveItems,
  onClose,
}) => {
  const [usersVideoCell, setUsersVideoCell] = useState(users);
  const [cellCount, setCellCount] = useState(0);
  const videoCellArray = videoMode.split("x").map(Number);
  const videoCellCount = videoCellArray.reduce((acc, rec) => acc * rec);
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const videoCell = getLayoutStructure(videoCellCount, isDesktop);
  const [selectUsersModal, setSelectUsersModal] = useState(false);
  const clickHandler = (count: number) => {
    setCellCount(count);
    setSelectUsersModal(!selectUsersModal);
  };

  const closeModalUsers = () => {
    setSelectUsersModal(false);
  };

  const addUserCell = (user: User) => {
    const userVideoCell = usersVideoCell.map((item) =>
      item.number === user.number
        ? { ...item, video_cell: cellCount, video_out: true }
        : item
    );
    setUsersVideoCell(userVideoCell);
    setSelectUsersModal(false);
  };

  const removeUserCell = (user: User) => {
    const userVideoCell = usersVideoCell.map((item) =>
      item.number === user.number
        ? { ...item, video_cell: 0, video_out: false }
        : item
    );

    setUsersVideoCell(userVideoCell);
  };

  const closeModal = () => {
    onClose();
    setUsersVideoCell(users);
    setSelectUsersModal(false);
  };

  const renderUsers = () => {
    let count = 0;

    return videoCell.map((columns, row) => {
      return Array.from(Array(columns).keys()).map((x, index) => {
        count++;
        const user = usersVideoCell.filter(
          (item) => item.video_cell === count
        )[0];
        const cellCount = count;
        return (
          <VideoCellCard
            proportion={columns}
            className={clsx(styles.UserItem, { [styles.UserItemCell]: user })}
          >
            {user ? (
              <div
                className={styles.UserItemCard}
                onContextMenu={(event) => {
                  event.preventDefault();
                  removeUserCell(user);
                }}
              >
                <Avatar size={columns > 3 ? 60 : 120} name={user.name} />
                <div className={styles.UserItemCardName}>{user.name}</div>
              </div>
            ) : (
              <div
                className={styles.UserItemEmpty}
                onClick={() => clickHandler(cellCount)}
              >
                <Icon name={"empty"} />
              </div>
            )}
          </VideoCellCard>
        );
      });
    });
  };
  return (
    <div className={clsx(styles.Wrapper, styles[`Wrapper-${breakpoint}`])}>
      <div className={clsx(styles.Place, styles[`Place-${breakpoint}`])}>
        {renderUsers()}
      </div>
      <VideoUsersModal
        show={selectUsersModal}
        onClose={closeModal}
        back={closeModalUsers}
        actionHandler={addUserCell}
        cellCount={cellCount}
        videoMode={videoMode}
        users={users}
        desktopHeader
      />
      <div className={styles.ActionButtons}>
        <Button color="var(--accent-color)" onClick={() => closeModal()}>
          Отмена
        </Button>
        <Button dark onClick={() => saveItems(usersVideoCell)}>
          Сохранить
        </Button>
      </div>
    </div>
  );
};
