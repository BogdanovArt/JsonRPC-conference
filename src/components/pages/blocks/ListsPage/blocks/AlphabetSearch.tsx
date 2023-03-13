import { useMemo } from "react";

import { Participant } from "../../SelectorPage/types";

import styles from "./AlphabetSearch.module.scss";

interface Props {
  users: Participant[];
}

export const AlphabetSearchBar: React.FC<Props> = ({ users }) => {
  const Letters = useMemo(() => {
    const filtered: { [key: string]: null } = {};
    users.forEach((user) => {
      filtered[user.displayname?.[0]] = null;
    });
    return Object.keys(filtered).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const letterClickHandler = (marker: string) => {
    const match = document.querySelectorAll(
      `div[data-search-marker='${marker}']`
    )?.[0];
    match?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Bar}>
        {Letters.map((marker, index) => (
          <div
            key={index}
            className={styles.Letter}
            onClick={() => letterClickHandler(marker)}
          >
            {marker}
          </div>
        ))}
      </div>
    </div>
  );
};
