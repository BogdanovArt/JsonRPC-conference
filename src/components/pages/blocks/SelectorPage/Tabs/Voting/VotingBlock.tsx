import { useState } from "react";

import { ChartWrapper as Chart } from "components/common/UI/Chart";
import { Expand } from "components/common/UI/Expand";

import { IBasicObject } from "types/index";
import { VotingStatuses } from "types/enums";
import { VotingStates } from "../../types";

import styles from "./VotingBlock.module.scss";

const colors = [
  "#50a3a5",
  "#EB5233",
  "#D1D4D9",
  "#b9b638",
  "#a3dfa7",
  "#286b57",
  "#e8ca88",
  "#32628F",
  "#A15E20",
  "#3bc8f5",
];

type GraphType = "histogram" | "diagram" | "table";

interface Props {
  title?: string;
  state?: VotingStates;
  options: IBasicObject;
  users: IBasicObject[];
  results: IBasicObject;
  changeState: () => void;
  remove: () => void;
}

export const VotingBlock = ({
  title,
  options,
  users,
  state,
  results,
  changeState,
  remove,
}: Props) => {
  const [tab, setTab] = useState<GraphType>("table");

  const convertedData = Object.keys(options).map((opt) => {
    return results
      ? Object.keys(results).filter((key: string) => results[key] === opt)
          .length
      : 0;
  });

  const getResultName = (user: IBasicObject) => {
    return options?.[results?.[user.id as string] as string];
  };

  const renderStatusButton = () => {
    switch (state) {
      case VotingStatuses.ENDED:
        return (
          <div className={styles.ControlsButton} title="Опрос завершен">
            <img src={"svg/waiting.svg"} />
          </div>
        );
      case VotingStatuses.STARTED:
        return (
          <div
            className={styles.ControlsButton}
            title="Остановить опрос"
            onClick={() => changeState()}
          >
            <img src={"svg/playerstop.svg"} />
          </div>
        );
      default:
        return (
          <div
            className={styles.ControlsButton}
            title="Запустить опрос"
            onClick={() => changeState()}
          >
            <img src={"svg/playerplay.svg"} />
          </div>
        );
    }
  };

  const renderInfo = ({
    list = [],
    title = "",
  }: {
    list?: string[];
    title?: string;
  }) => {
    return (
      <div className={styles.Info}>
        <div className={styles.InfoTitle}>{title}</div>
        <div className={styles.InfoList}>
          {list.map((item, index) => (
            <div key={index} className={styles.InfoListItem}>
              <span
                style={{ background: colors[index] }}
                className={styles.InfoListDot}
              ></span>
              <span className={styles.Ellipsis}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTab = () => {
    switch (tab) {
      case "histogram":
        return (
          <div className={styles.GraphicBlock}>
            <div className={styles.Graphic}>
              <Chart
                type="bar"                
                colors={colors}
                labels={Object.keys(options)}
                data={convertedData}
              />
            </div>
            {renderInfo({
              list: Object.values(options) as string[],
              title: "Ответ",
            })}
          </div>
        );
      case "diagram":
        return (
          <div className={styles.GraphicBlock}>
            <div className={styles.Graphic}>
              <Chart
                type="doughnut"
                colors={colors}
                labels={Object.keys(options)}
                data={convertedData}
              />
            </div>
            {renderInfo({
              list: Object.values(options) as string[],
              title: "Ответ",
            })}
          </div>
        );
      default:
        const votedUsers = users.filter((user) => !!getResultName(user));

        const totalUsers = users.length;
        const notVoted = totalUsers - votedUsers.length;
        const online = users.filter((user) => user.state === "online").length;

        const names = votedUsers.map((user) => user.name) as string[];
        const votes = votedUsers.map(getResultName) as string[];
        return (
          <>
            <div className={[styles.GraphicBlock, styles.Table].join(" ")}>
              {renderInfo({
                list: names,
                title: "Участник",
              })}
              {renderInfo({
                list: votes,
                title: "Ответ",
              })}
            </div>
            <div className={styles.InfoUsers}>
              <span>Всего участников:</span>{" "}
              <span>{totalUsers}</span>
              <span>Онлайн:</span>
              <span>{online}</span>
              <span>Не голосовало:</span>
              <span>{notVoted}</span>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.Wrapper}>
      <Expand
        initial={true}
        style={{ borderRadius: 6, padding: "0 10px 0" }}
        title={title}
      >
        {renderTab()}
        <div className={[styles.Controls, styles.ControlsWrapper].join(" ")}>
          <div className={styles.Controls}>
            <div
              className={[
                styles.ControlsButton,
                tab === "diagram" && styles.ControlsActive,
              ].join(" ")}
              onClick={() => setTab("diagram")}
            >
              <img src="svg/diagram.svg" />
            </div>
            <div
              style={{ marginBottom: -2 }}
              className={[
                styles.ControlsButton,
                tab === "histogram" && styles.ControlsActive,
              ].join(" ")}
              onClick={() => setTab("histogram")}
            >
              <img src="svg/histogram.svg" />
            </div>
            <div
              className={[
                styles.ControlsButton,
                tab === "table" && styles.ControlsActive,
              ].join(" ")}
              onClick={() => setTab("table")}
            >
              <img src="svg/table.svg" />
            </div>
          </div>
        </div>
      </Expand>

      <div className={[styles.Controls, styles.Absolute].join(" ")}>
        {renderStatusButton()}
        <div className={styles.ControlsButton} onClick={() => remove()}>
          <img src="svg/remove.svg" />
        </div>
      </div>
    </div>
  );
};
