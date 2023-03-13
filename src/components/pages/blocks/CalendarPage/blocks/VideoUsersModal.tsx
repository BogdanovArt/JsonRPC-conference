import styles from "./VideoUsersModal.module.scss";
import { CallUser as User } from "components/pages/blocks/SelectorPage/types";
import { IconWrap } from "components/pages/blocks/SelectorPage/Layout/Layout";
import { Icon, IconName } from "@oktell/icons";
import { SlideModal } from "components/common/Modal/SlideModal";
import React, { useMemo, useState } from "react";
import { CompactUserItem } from "components/pages/blocks/SelectorPage/Tabs/Participants/CompactUserItem";
import { Input } from "components/common/Inputs/Input";

interface Props {
  show: boolean;
  users?: User[];
  videoMode?: string;
  cellCount?: number;
  actionHandler?: (user: User) => void;
  hideArrow?: boolean;
  desktopHeader?: boolean;
  timeout?: number;
  back?: () => void;
  onClose?: () => void;
}

export const VideoUsersModal: React.FC<Props> = ({
  show,
  users,
  videoMode,
  cellCount,
  actionHandler,
  hideArrow,
  desktopHeader,
  timeout,
  back,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const searchHandler = (name: string, value: string) => {
    setSearch(value);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const userName = user.name.toLowerCase();
      return (
        user.number?.toString().includes(search) ||
        userName.includes(search.toLowerCase())
      );
    });
  }, [search]);

  return (
    <SlideModal
      show={show}
      hideArrow={hideArrow}
      desktopHeader={desktopHeader}
      timeout={timeout}
      header={
        <div className={styles.SlideModalHeader}>
          <IconWrap
            pathCount={cellCount}
            className={styles.SlideModalHeaderIcon}
          >
            <Icon
              name={`grid-${videoMode}` as IconName}
              className={styles.IconModal}
            />
          </IconWrap>
          <button
            className={styles.SlideModalHeaderButton}
            onClick={() => onClose()}
          >
            <Icon name="close" />
          </button>
        </div>
      }
      onClose={back}
    >
      <div>
        <div className={styles.SearchWrap}>
          <Input
            name="search"
            placeholder="Поиск"
            initial={search}
            onChange={searchHandler}
            after={
              <div className={styles.SearchControls}>
                {search ? (
                  <Icon
                    name="clear"
                    className={styles.SearchButton}
                    onClick={() => setSearch("")}
                  />
                ) : null}
                <Icon name="search" className={styles.SearchButton} />
              </div>
            }
          />
        </div>
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className={styles.UserList}
            onClick={() => actionHandler(user)}
          >
            <CompactUserItem user={user} />
          </div>
        ))}
      </div>
    </SlideModal>
  );
};
