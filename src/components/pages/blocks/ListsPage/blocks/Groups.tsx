import clsx from "clsx";
import { useSelector } from "react-redux";

import { Department } from "../Lists";

import { getBreakPoint } from "store/core/getters";

import styles from "./Groups.module.scss";
import { Icon } from "@oktell/icons";

interface Props {
  items: Department[];
  active: string;
  action: (item: string) => void;
}

export const Groups: React.FC<Props> = ({
  items,
  active,
  action = () => null,
}) => {
  const breakpoint = useSelector(getBreakPoint);

  return (
    <div className={clsx(styles.Group, styles[`Group-${breakpoint}`])}>
      {items.map((item) => (
        <div
          key={item.key}
          className={clsx(styles.GroupItem, {
            [styles.GroupItemActive]: item.key === active,
          })}
          onClick={() => action(item.key as string)}
        >
          {item.key === active ? (
            <Icon name="check" className={styles.GroupItemActiveIcon} />
          ) : null}
          <span>
            {item.title} {item.users ? ` (${item.users})` : ""}
          </span>
        </div>
      ))}
    </div>
  );
};
