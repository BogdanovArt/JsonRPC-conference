import { useMemo, useState } from "react";
import { Icon } from "@oktell/icons";
import { TouchEvents } from "@oktell/inputs";
import { isMobile, isTablet } from "react-device-detect";
import clsx from "clsx";

import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { Input } from "components/common/Inputs/Input";
import { UserItemProps } from "./UserItem";

import { ActionHandler, CallUser } from "../../types";

import styles from "./Participants.module.scss";
import { UserList } from "./UserList";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

interface Props {
  selectorId?: string;
  users?: CallUser[];
  actionHandler?: ActionHandler;
  UserComponent: React.FC<UserItemProps>;
  hands?: boolean;
  isVideo?: boolean;
}

export const ParticipantsList: React.FC<Props> = ({
  selectorId,
  actionHandler,
  users = [],
  UserComponent,
  hands,
  isVideo,
}) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const breakpoint = useSelector(getBreakPoint);
  const isTouchDevice = isMobile || isTablet;

  const searchHandler = (name: string, value: string) => {
    setSearch(value);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.includes(search) || user.number.toString().includes(search)
    );
  }, [users, search]);

  return (
    <>
      {!hands ? (
        <div
          className={clsx(
            styles[`WrapperSearch-${breakpoint}`],
            {
              [styles.WrapperSearchTablet]: isTouchDevice,
              [styles.WrapperSearchShow]: showSearch && isTouchDevice,
            },
            "ParticipantsSearch"
          )}
        >
          <Input
            placeholder="Поиск"
            onChange={searchHandler}
            after={<Icon name="search" className={styles.Search} />}
          />
        </div>
      ) : null}
      <ScrollContainer className={styles.List}>
        <TouchEvents
          onSwipeDown={() => setShowSearch(true)}
          onSwipeUp={() => setShowSearch(false)}
        >
          <UserList
            selectorId={selectorId}
            users={filteredUsers}
            UserComponent={UserComponent}
            actionHandler={actionHandler}
            emptyMessage={"Поиск не дал результатов"}
            hands={hands}
            isVideo={isVideo}
          />
        </TouchEvents>
      </ScrollContainer>
    </>
  );
};
