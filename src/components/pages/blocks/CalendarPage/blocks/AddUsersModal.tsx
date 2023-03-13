import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Avatar } from "@oktell/header-panel";
import { SIPNumber } from "@oktell/softphone";
import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { Popover } from "@material-ui/core";
import { useSelector } from "react-redux";

import { SlideModal } from "components/common/Modal/SlideModal";
import { Button } from "components/common/UI/Button";
import { CheckBox } from "components/common/Inputs/CheckBox";
import { Input } from "components/common/Inputs/Input";
import { AddParticipant } from "../../SelectorPage/Tabs/Participants/AddParticipant";

import { ActionHandler, CallUser } from "../../SelectorPage/types";
import { IBasicObject } from "types/index";
import { copy } from "utils/copy";
import { highlight } from "utils/highlight";

import { getBreakPoint } from "store/core/getters";

import styles from "./AddUsersModal.module.scss";

interface Props {
  show?: boolean;
  users: CallUser[];
  addedUsers: CallUser[];
  actionHandler?: ActionHandler;
  onClose?: () => void;
}

interface Group {
  key: string;
  amount: number;
}

export const AddUsersModal: React.FC<Props> = ({
  show,
  users,
  addedUsers = [],
  actionHandler = () => null,
  onClose = () => null,
}) => {
  const [selected, setSelected] = useState<SIPNumber[]>(
    addedUsers.map((user) => user.number)
  );
  const [customUsers, setCustomUsers] = useState<CallUser[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<Group>(null);
  const [showGroups, setShowGroups] = useState(false);

  const [search, setSearch] = useState("");

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  const groupToggler = useRef<HTMLDivElement>(null);

  const userAddHandler: ActionHandler = async (
    action,
    payload: IBasicObject
  ) => {
    // console.warn(payload.participant);
    const participant = payload.participant as CallUser;
    const match = selected.includes(participant.number);
    if (match) {
      setTimeout(() => {
        alert("Пользователь с таким номером уже добавлен");
      }, 10);
    } else {
      addCustomUser(participant);
      addSelectedUser(participant);
    }
  };

  const addCustomUser = useCallback(
    (user: CallUser) => {
      const clone = copy(customUsers);
      clone.push(user);
      setCustomUsers(clone);
    },
    [customUsers]
  );

  const addSelectedUser = useCallback(
    (user: CallUser) => {
      const clone = copy(selected);
      clone.push(user.number);
      setSelected(clone);
    },
    [selected]
  );

  const removeSelectedUser = useCallback(
    (user: CallUser) => {
      const clone = copy(selected);
      const index = clone.findIndex((number) => number === user.number);
      clone.splice(index, 1);
      setSelected(clone);
    },
    [selected]
  );

  const totalUsers = useMemo(() => {
    return [...users, ...customUsers];
  }, [users, customUsers]);

  const rowClickHandler = (user: CallUser) => {
    if (selected.includes(user.number)) {
      removeSelectedUser(user);
    } else {
      addSelectedUser(user);
    }
  };

  const allSelectHandler = () => {
    setSelected(allSelected ? [] : filteredUsers.map((user) => user.number));
  };

  const confirmHandler = () => {
    const users = selected.map((number) => {
      const match = totalUsers.find((user) => user.number === number);
      return match;
    });
    actionHandler("add_users", { users });
    onClose();
  };

  const searchHandler = (name: string, value: string) => {
    setSearch(value);
  };

  const groupClickHandler = (group: Group | null) => {
    setShowGroups(false);
    setSelectedGroup(group);
  };

  const filteredUsers = useMemo(() => {
    return totalUsers.filter((user) => {
      const searchResult =
        user.number?.toString().includes(search) || user.name?.includes(search);
      const groupResult = selectedGroup
        ? user.department === selectedGroup.key
        : true;
      return groupResult && searchResult;
    });
  }, [totalUsers, selectedGroup, search]);

  const allSelected = useMemo(() => {
    const USERS = filteredUsers;
    for (let i = 0; i < USERS.length; i++) {
      const user = USERS[i];
      if (!selected.includes(user.number)) return false;
    }
    return true;
  }, [filteredUsers, selected]);

  const groups = useMemo(() => {
    const counter: { [key: string]: number } = {};

    users.forEach((user) => {
      const amount = counter[user.department];
      if (amount) {
        counter[user.department] = amount + 1;
      } else {
        counter[user.department] = 1;
      }
    });
    return Object.entries(counter);
  }, [users]);

  useEffect(() => {
    const newSelected = addedUsers.map((user) => user.number);
    if (show && JSON.stringify(newSelected) !== JSON.stringify(selected)) {
      setSelected(newSelected);
    }
  }, [show]);

  return (
    <SlideModal
      show={show}
      header={<div>Участники</div>}
      beforeContent={
        <div className={styles.ModalContent}>
          <div className={styles.UserListControls}>
            <div
              ref={groupToggler}
              className={styles.Toggler}
              onClick={() => setShowGroups(true)}
            >
              <span>{selectedGroup ? selectedGroup.key : "Все контакты"}</span>
              <Icon
                name="chevronfilled"
                className={clsx(styles.Icon, {
                  [styles.IconReverse]: showGroups,
                })}
              />
            </div>
            {groupToggler ? (
              <Popover
                anchorEl={groupToggler.current}
                container={groupToggler.current}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={showGroups}
                onClose={() => setShowGroups(false)}
              >
                <div className={styles.Popover}>
                  <button
                    className={clsx(styles.PopoverButton, {
                      [styles.PopoverButtonActive]: !selectedGroup,
                    })}
                    onClick={() => groupClickHandler(null)}
                  >
                    Все
                  </button>
                  {groups.map(([key, amount]) => (
                    <button
                      key={key}
                      className={clsx(styles.PopoverButton, {
                        [styles.PopoverButtonActive]:
                          key === selectedGroup?.key,
                      })}
                      onClick={() => groupClickHandler({ key, amount })}
                    >
                      {key} {amount ? `(${amount})` : null}
                    </button>
                  ))}
                </div>
              </Popover>
            ) : null}

            <AddParticipant iconSize={24} onAdd={userAddHandler} />
          </div>
          <div>
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
          <div>
            <div
              className={clsx(styles.UserItem, styles.SelectAll)}
              onClick={() => allSelectHandler()}
            >
              <div style={{ pointerEvents: "none" }}>
                <CheckBox big initial={allSelected} />
              </div>
              Выбрать всех
            </div>
            <div className="divider"></div>
          </div>
        </div>
      }
      footer={
        isDesktop ? (
          <>
            <Button
              color="var(--accent-color)"
              className={styles.Button}
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button dark className={styles.Button} onClick={confirmHandler}>
              Добавить
            </Button>
          </>
        ) : null
      }
      onClose={onClose}
      onConfirm={confirmHandler}
    >
      <div className={styles.UserList}>
        {filteredUsers.map((user, index) => (
          <div key={user.number}>
            <div
              className={styles.UserItem}
              onClick={() => rowClickHandler(user)}
            >
              <div style={{ pointerEvents: "none" }}>
                <CheckBox big initial={selected.includes(user.number)} />
              </div>

              <div className={styles.UserItemName}>
                <Avatar size={24} name={user.name} />
                <span>{highlight(user.name, search)}</span>
              </div>
              <div className={styles.UserItemNumber}>
                {highlight(user.number.toString(), search)}
              </div>
            </div>
            <div className="divider"></div>
          </div>
        ))}
      </div>
    </SlideModal>
  );
};
