import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import reactStringReplace from "react-string-replace";
import { useSelector } from "react-redux";

import { CallUser, ActionHandler, Voting } from "../SelectorPage/types";

import { Swipeable } from "components/common/UI/Swipeable";
import { AddButton } from "../SelectorPage/Tabs/Participants/AddButton";
import { CurrentVotingModal } from "../SelectorPage/Tabs/Voting/CurrentVotingModal";
import { CreateVotingModal } from "../SelectorPage/Tabs/Voting/CreateVotingModal";

import { getBreakPoint } from "store/core/getters";

import selectorStyles from "../SelectorPage/SelectorPage.module.scss";
import styles from "./SelectorVotings.module.scss";
import itemStyles from "../SelectorPage/Tabs/Participants/UserItem.module.scss";
import { IBasicObject } from "types/index";

interface Props {
  edit?: boolean;
  controlled?: boolean;
  votings: Voting[];
  users: CallUser[];
  search?: string;
  notCreate?: boolean;
  actionHandler?: ActionHandler;
}

// @TODO - create edit state for CreateVotingModal

export const SelectorVotings: React.FC<Props> = ({
  controlled,
  edit,
  votings,
  users,
  search,
  notCreate,
  actionHandler,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [activeVoting, setActiveVoting] = useState<Voting | null>(null);
  const [activeVotingIndex, setActiveVotignIndex] = useState<number>(null);

  const breakpoint = useSelector(getBreakPoint);

  const activeContent = useMemo(() => {
    return activeVoting
      ? votings.find((voting) => voting.id === activeVoting.id)
      : null;
  }, [activeVoting, votings]);

  const renderStatusIcon = (voting: Voting) => {
    switch (voting.state) {
      case "opened":
        return <div className={selectorStyles.Notification}></div>;
      case "closed":
        return <Icon name="filechart" className={styles.Icon} />;
      default:
        return null;
    }
  };

  const actionHandlerModified: ActionHandler = async (action, payload) => {
    const pl =
      activeVotingIndex === null
        ? payload
        : { ...(payload as IBasicObject), index: activeVotingIndex };
    actionHandler(action, pl);
  };

  const removeHandler = (voting: Voting, index?: number) => {
    actionHandler("delete_voting", { voting: { ...voting }, index });
    setOpenAddModal(false);
    setActiveVoting(null);
  };

  const clickHandler = (voting: Voting, index: number) => {
    setActiveVoting(voting);
    setActiveVotignIndex(index);
  };

  const closeHandler = () => {
    setActiveVoting(null);
    setActiveVotignIndex(null);
  };

  const renderVotings = () => {
    return (
      <>
        {votings?.map((voting, index) => (
          <div
            key={voting.id || `${index}-voting`}
            className={clsx(styles.ListItem, styles[`ListItem-${breakpoint}`])}
            onClick={() => clickHandler(voting, index)}
          >
            {["lg", "xl"].includes(breakpoint) ? (
              search ? (
                reactStringReplace(voting.name, search, (match, index) => (
                  <span key={index} className={styles.ListItemSearchActive}>
                    {match}
                  </span>
                ))
              ) : (
                voting.name
              )
            ) : (
              <div className={clsx(itemStyles.MobUser, "voting-compact")}>
                <Swipeable
                  disabled={!edit}
                  swipeAway
                  before={<div className={itemStyles.Spacer}></div>}
                  after={<div className={itemStyles.Spacer}></div>}
                  onSwipeLeft={() => removeHandler(voting, index)}
                  onSwipeRight={() => removeHandler(voting, index)}
                >
                  <div className={itemStyles.User}>
                    <div className={itemStyles.UserName}>
                      <span>{voting.name}</span>
                    </div>

                    <Icon
                      name="chevron"
                      style={{ transform: "rotate(90deg)" }}
                      className={itemStyles.MobUserIcon}
                    />
                  </div>
                </Swipeable>
              </div>
            )}
            {renderStatusIcon(voting)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={clsx(styles.Wrapper)}>
      <div className={clsx(styles.Header)}>
        Опросы
        <div className={styles.Expander} />
        {!notCreate ? (
          <AddButton size={24} onClick={() => setOpenAddModal(true)} />
        ) : null}
      </div>
      <div className={clsx(styles.List, styles[`List-${breakpoint}`])}>
        {renderVotings()}
      </div>

      {!edit ? (
        <CurrentVotingModal // @TODO add currentVoting for existing selector preview case
          readonly={!controlled}
          show={!!activeVoting}
          users={users}
          content={activeContent}
          actionHandler={actionHandlerModified}
          onClose={closeHandler}
        />
      ) : (
        <CreateVotingModal
          edit
          show={!!activeVoting}
          voting={activeContent}
          toggle={closeHandler}
          actionHandler={actionHandlerModified}
          removeHandler={removeHandler}
        />
      )}

      <CreateVotingModal
        show={openAddModal}
        toggle={setOpenAddModal}
        actionHandler={actionHandlerModified}
        removeHandler={removeHandler}
      />
    </div>
  );
};
