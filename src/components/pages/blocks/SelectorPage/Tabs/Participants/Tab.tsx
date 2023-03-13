import { HTMLAttributes, useMemo, useState } from "react";
import { Icon } from "@oktell/icons";
import clsx from "clsx";

import { ParticipantsList } from "./ParticipantsList";
import { AddParticipant } from "./AddParticipant";
import { UserItem } from "./UserItem";

import {
  ActionHandler,
  CallUser,
  Counter,
  FilterAction,
  UserFilters,
} from "../../types";

import { FilterMenu } from "./FilterMenu";

import styles from "./Participants.module.scss";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";
import { isMobile, isTablet } from "react-device-detect";

interface Props extends HTMLAttributes<HTMLDivElement> {
  readonly?: boolean;
  selectorId?: string;
  users?: CallUser[];
  actionHandler?: ActionHandler;
  hands?: boolean;
  isVideo?: boolean;
}

export const ParticipantsTab: React.FC<Props> = ({
  readonly,
  selectorId,
  actionHandler,
  users = [],
  className,
  hands = false,
  isVideo = false,
  ...rest
}) => {
  const [filters, setFilters] = useState<UserFilters>({});
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const filterAction: FilterAction = (key, value) => {
    if (!key || !value) {
      setFilters({});
      return;
    }

    setFilters({ [key]: value });
  };

  const Filter = (user: CallUser) => {
    let show = true;

    Object.keys(filters).forEach((key: keyof CallUser) => {
      if (user[key] !== filters[key]) show = false;
    });

    return show;
  };

  const usersCounter = useMemo(() => {
    const counter: Counter & { total: number } = {
      listener: 0,
      assistant: 0,
      speaker: 0,
      total: 0,
    };
    users.forEach((user) => {
      counter.total++;
      counter[user.topology_type]++;
    });
    return counter;
  }, [users]);

  const usersMic = useMemo(() => {
    let micOn = 0;
    users.forEach((item) => {
      if (item.mic) {
        micOn++;
      }
    });

    return micOn > 0;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(Filter)
      .sort((a) => (a.topology_type !== "listener" ? -1 : 1));
  }, [users, filters]);

  const filteredUsersHands = useMemo(() => {
    return users
      .filter((item) => item.is_hand_raised)
      .sort((a) => (a.topology_type !== "listener" ? -1 : 1));
  }, [users]);

  const rUserId = localStorage.getItem("rUserId");
  const actionButton = (action: string) => {
    actionHandler(action, {
      selectorId: {
        id: selectorId,
      },
      rUserId,
    });
  };

  return (
    <div
      className={clsx(
        styles.Wrapper,
        styles[`Wrapper-${breakpoint}`],
        className,
        { [styles.WrapperTablet]: isTouchDevice },
        "participants-tab"
      )}
      {...rest}
    >
      {!hands ? (
        <div
          className={clsx(
            styles.Controls,
            styles[`Controls-${breakpoint}`],
            "ParticipantsControls"
          )}
        >
          {isDesktop && !isTouchDevice ? (
            <>
              <FilterMenu
                count={usersCounter}
                activeFilters={filters}
                action={filterAction}
              />
              <span style={{ flex: 1 }} />
              {usersMic ? (
                <Icon
                  onClick={() => actionButton("participant_all_mic_mute")}
                  name="nomic"
                  className={clsx(styles.Icon, "readonly")}
                />
              ) : (
                <Icon
                  onClick={() => actionButton("participant_all_mic_unmute")}
                  name="mic"
                  className={clsx(styles.Icon, "readonly")}
                />
              )}
            </>
          ) : null}

          <AddParticipant
            shadow
            absoluteAddButton
            onAdd={actionHandler}
            iconSize={isDesktop && !isTouchDevice ? 32 : 48}
          />
        </div>
      ) : null}
      <ParticipantsList
        selectorId={selectorId}
        users={hands ? filteredUsersHands : filteredUsers}
        actionHandler={actionHandler}
        UserComponent={UserItem}
        hands={hands}
        isVideo={isVideo}
      />
    </div>
  );
};
