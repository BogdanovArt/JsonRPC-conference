import clsx from "clsx";

import { IBasicObject } from "types/index";

import styles from "./TimesList.module.scss";

interface Props {
  active?: string;
  items: IBasicObject[];
  onItemClick?: (value: string) => void;
}

export const TimesList: React.FC<Props> = ({
  items,
  active,
  onItemClick = () => null,
}) => {
  return (
    <div className={styles.List}>
      {items.map((item) => (
        <div
          key={item.value as string}
          className={styles.Item}
          onClick={() => onItemClick(item.value as string)}
        >
          <span className={styles.ItemTitle}>{item.title}</span>
          {item.subtitle ? (
            <span className={styles.ItemSubtitle}>({item.subtitle})</span>
          ) : null}
          <span
            className={clsx(styles.ItemMark, {
              [styles.ItemMarkActive]: item.value === active,
            })}
          ></span>
        </div>
      ))}
    </div>
  );
};
