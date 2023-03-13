import { useMemo } from "react";

import { SlideModal } from "components/common/Modal/SlideModal";
import { Button } from "components/common/UI/Button";
import { VotingView } from "./blocks/VotingView";
import { VotedList } from "./VotedList";

import { ActionHandler, CallUser, Voting } from "../../types";
import { Percents } from "./blocks/types";

import { copy } from "utils/copy";

import styles from "./VotingNew.module.scss";
import {useSelector} from "react-redux";
import {getBreakPoint} from "store/core/getters";

interface Props {
  readonly?: boolean;
  shadow?: boolean;
  show?: boolean;
  content: Voting;
  users: CallUser[];
  onClose?: () => void;
  actionHandler?: ActionHandler;
}

const Footer: React.FC = ({ children }) => {
  return (
    <div className={styles.Footer}>
      <div className="divider" />
      {children}
    </div>
  );
};

export const CurrentVotingModal: React.FC<Props> = ({
  readonly,
  shadow,
  show,
  content,
  users,
  onClose = () => null,
  actionHandler = () => null,
}) => {
  const breakpoint = useSelector(getBreakPoint);
  const votePercents = useMemo(() => {
    if (!content) return {};

    const result: Percents = {};

    const votes = copy(content.cases);
    const results = Object.values(content?.results || {});

    for (const vote in votes) {
      const amount = results.filter((result) => result === vote).length;
      const percent = (100 * amount) / results.length;
      result[vote] = {
        width: percent ? percent : 0,
        title: votes[vote],
        amount,
      };
    }

    return result;
  }, [content]);

  const deleteVoting = async () => {
    await actionHandler("delete_voting", { votingId: content.id });
    onClose();
  };

  const startVoting = async () => {
    await actionHandler("voting_state_update", { votingId: content.id });
  };

  const stopVoting = async () => {
    await actionHandler("voting_state_update", { votingId: content.id });
  };

  const renderControls = () => {
    if (readonly) return null;
    switch (content?.state) {
      case "inited":
        return (
          <Footer>
            <Button
              color="var(--accent-color)"
              className={styles.DeleteButton}
              onClick={startVoting}
            >
              Запустить опрос
            </Button>
          </Footer>
        );
      case "opened":
        return (
          <Footer>
            <Button
              color="var(--color-red)"
              className={styles.DeleteButton}
              onClick={stopVoting}
            >
              Остановить опрос
            </Button>
          </Footer>
        );
      default:
        return null;
    }
  };



  return (
    <SlideModal
      shadow={shadow}
      show={show}
      before={
        content?.state === "closed" ? (
          <div className={styles.AboveControls}>
            <span className={styles.LinkButton} onClick={deleteVoting}>
              Удалить
            </span>
          </div>
        ) : null
      }
      header={<div>{content?.name}</div>}
      footer={renderControls()}
      onClose={() => onClose()}
      className={`CurrentVotingModal CurrentVotingModal-${breakpoint}`}
    >
      {content ? (
        <>
          <div className={styles.Content}>
            <VotingView percents={votePercents} />
            <VotedList
              voting={content}
              users={users}
              percentage={votePercents}
            />
          </div>
        </>
      ) : null}
    </SlideModal>
  );
};
