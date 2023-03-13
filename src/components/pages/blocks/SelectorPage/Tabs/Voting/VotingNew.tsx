import { useMemo, useState } from "react";
import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

import { AddButton } from "../Participants/AddButton";
import { CreateVotingModal } from "./CreateVotingModal";
import { CurrentVotingModal } from "./CurrentVotingModal";

import { ActionHandler, CallUser, Voting } from "../../types";

import selectorStyles from "../../SelectorPage.module.scss";
import styles from "./VotingNew.module.scss";
import { isMobile, isTablet } from "react-device-detect";

interface Props {
  shadow?: boolean;
  controlled?: boolean;
  votings: Voting[];
  users: CallUser[];
  actionHandler?: ActionHandler;
  compact?: boolean;
}

export const VotingTab: React.FC<Props> = ({
  shadow,
  controlled,
  votings,
  users,
  actionHandler,
  compact,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [activeVoting, setActiveVoting] = useState<Voting | null>(null);
  const sizeAddButton = compact ? 24 : 32;
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

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

  return (
    <div
      className={clsx(
        styles.Wrapper,
        styles[`Wrapper-${breakpoint}`],
        { [styles.WrapperTablet]: isTouchDevice },
        "VotingTab"
      )}
    >
      <div
        className={clsx(
          styles.Header,
          styles[`Header-${breakpoint}`],
          { [styles.HeaderTablet]: isTouchDevice },
          "TabHeader"
        )}
      >
        {isDesktop && !isTouchDevice ? (
          <>
            <div>Опросы</div>
            <div className={styles.Expander} />
          </>
        ) : null}

        <AddButton
          size={isDesktop && !isTouchDevice ? sizeAddButton : 48}
          onClick={() => setOpenAddModal(true)}
        />
      </div>
      <div
        className={clsx(
          styles.List,
          styles[`List-${breakpoint}`],
          { [styles.ListTablet]: isTouchDevice },
          "VotingList"
        )}
      >
        {votings?.map((voting) => (
          <div
            key={voting.id}
            className={clsx(
              styles.ListItem,
              styles[`ListItem-${breakpoint}`],
              { [styles.ListItemTablet]: isTouchDevice },
              "VotingItem"
            )}
            onClick={() => setActiveVoting(voting)}
          >
            {voting.name}
            {renderStatusIcon(voting)}
          </div>
        ))}
      </div>
      <CurrentVotingModal
        readonly={!controlled}
        shadow={shadow}
        show={!!activeVoting}
        users={users}
        content={activeContent}
        actionHandler={actionHandler}
        onClose={() => setActiveVoting(null)}
      />
      <CreateVotingModal
        // voting={tempSelectorData.selector.votings[0] as Voting}
        shadow={shadow}
        show={openAddModal}
        toggle={setOpenAddModal}
        actionHandler={actionHandler}
        removeHandler={() => null}
      />
    </div>
  );
};
