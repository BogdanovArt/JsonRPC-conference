import { Line } from "./Line";

import { getColor } from "./consts";
import { Percents } from "./types";

import styles from "./VotingView.module.scss";

interface Props {
  percents: Percents;
}

export const VotingView: React.FC<Props> = ({ percents }) => {
  return (
    <div className={styles.Wrapper}>
      {Object.entries(percents).map(([key, value], index) => (
        <div key={key} className={styles.Line}>
          <div>
            {index + 1}: {value.title}
          </div>
          <Line width={value.width} amount={value.amount} color={getColor(index)} />
        </div>
      ))}
    </div>
  );
};
