import clsx from "clsx";
import { useCallback, useState } from "react";

import { CallUser, Voting } from "../../types";
import { UserList } from "../Participants/UserList";
import { getColor } from "./blocks/consts";
import { Line } from "./blocks/Line";
import { Percents } from "./blocks/types";

import styles from "./VotedList.module.scss";

interface Props {
  voting: Voting;
  users: CallUser[];
  percentage: Percents;
}

export const VotedList: React.FC<Props> = ({ voting, users, percentage }) => {
  const [show, setShow] = useState(false);

  const votedUsers = useCallback(() => {
    if (!voting.cases || !voting.results) return;
    const cases = Object.entries(voting.cases);
    const results = Object.entries(voting.results);
    return cases.map(([key, option], index) => {
      const voterIds = results
        .filter(([id, vote], index) => vote === key)
        .map(([id, vote]) => id);
      const voters = users.filter((user) => voterIds.includes(user.id));
      return (
        <div key={key} className={styles.VotingBlock}>
          <div className={styles.VotingBlockTitle}>
            {index + 1}: {option}
          </div>
          <Line
            width={percentage[key].width}
            color={getColor(index)}
            amount={percentage[key].amount}
          />
          <div className={styles.VotedUsers}>
            <UserList users={voters} />
          </div>
        </div>
      );
    });
  }, [users, voting]);

  const voted = voting.results ? Object.keys(voting.results).length : 0;

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <div
          className={clsx(styles.Toggler, { [styles.Active]: show })}
          onClick={() => setShow(!show)}
        >
          {`${voted} из ${users.length}`}
        </div>
        ответили
      </div>
      {show ? <div className={styles.Voted}>{votedUsers()}</div> : null}
    </div>
  );
};
