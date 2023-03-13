import { Portal } from "@oktell/header-panel";
import { Icon } from "@oktell/icons";
import { useEffect, useMemo, useState } from "react";
import { IBasicObject } from "types/index";

import { copy } from "utils/copy";

import { Participant } from "../../SelectorPage/types";
import { AlphabetSearchBar } from "./AlphabetSearch";
import { ListItem } from "./ListItem";

import styles from "./MobileList.module.scss";

interface Props {
  users: Participant[];
  selected: Participant[];
  returnValue?: (users: IBasicObject[]) => void;
}

export const MobileList: React.FC<Props> = ({
  users,
  selected,
  returnValue = () => null,
}) => {
  const [showHeader, setShowHeader] = useState(false);
  const allSelected = users.length === selected.length;

  const cancelSelection = () => {
    setShowHeader(false);
    returnValue([]);
  };

  const checkSelected = (user: Participant) => {
    return selected.some((s) => s.number === user.number);
  };

  const longPressHandler = (user: Participant) => {
    setShowHeader(true);
    selectUser(user);
  };

  const selectAllHandler = () => {
    returnValue(allSelected ? [] : users);
  };

  const selectUser = (user: Participant) => {
    const match = selected.findIndex((s) => s.number === user.number);

    if (match > -1) {
      const clone = copy(selected);
      clone.splice(match, 1);
      returnValue(clone);
    } else {
      returnValue([...selected, { ...user, name: user.displayname }]);
    }
  };

  const itemClickHandler = (item: Participant) => {
    if (!showHeader) return;
    selectUser(item);
  };

  const renderHeader = () => {
    return showHeader ? (
      <Portal id="header-portal">
        <div className={styles.SelectMode}>
          <Icon
            name="close"
            className={styles.SelectIcon}
            onClick={cancelSelection}
          />
          <div style={{ flexGrow: 1 }}></div>
          <Icon
            name="doublecheck"
            className={styles.SelectIcon}
            onClick={selectAllHandler}
          />
        </div>
      </Portal>
    ) : null;
  };

  const USERS = useMemo(() => {
    const source = copy(users);
    return source?.sort((a, b) =>
      a.displayname.localeCompare(b.displayname)
    ) as Participant[];
  }, [users]);

  return (
    <>
      <div className={styles.List}>
        {renderHeader()}
        {USERS?.map((user, index) => (
          <ListItem
            key={index}
            user={user}
            selected={checkSelected(user)}
            onClickAction={() => itemClickHandler(user)}
            onHoldAction={() => longPressHandler(user)}
          />
        ))}
      </div>
      <AlphabetSearchBar users={users} />
    </>
  );
};
