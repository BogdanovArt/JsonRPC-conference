import { Popover } from "@material-ui/core";
import { Icon } from "@oktell/icons";
import { useRef, useState } from "react";
import clsx from "clsx";

import { IBasicObject } from "types/index";

import { Counter, FilterAction, Topology, UserFilters } from "../../types";
import { roles } from "../../consts";

import styles from "./FilterMenu.module.scss";

interface Props {
  count: Counter & { total: number };
  action?: FilterAction;
  activeFilters?: UserFilters;
}
export const FilterMenu: React.FC<Props> = ({
  count,
  action = () => null,
  activeFilters,
}) => {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  const clickHandler: FilterAction = (key, value) => {
    setOpen(false);
    action(key, value);
  };

  return (
    <div>
      <div ref={anchor} className={styles.Filter} onClick={() => setOpen(true)}>
        Все участники
        {count.total ? (
          <span className={styles.Count}>({count.total})</span>
        ) : null}
        <Icon name="chevronfilled" />
      </div>
      <Popover
        open={open}
        anchorEl={anchor?.current}
        container={anchor?.current}
        onClose={() => setOpen(false)}
        PaperProps={{ className: styles.Menu }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className={styles.MenuItem} onClick={() => clickHandler()}>
          Все
        </div>
        {Object.entries(roles).map(([key, role]: [Topology, IBasicObject]) => (
          <div
            key={key}
            className={styles.MenuItem}
            onClick={() => clickHandler("topology_type", key)}
          >
            <div className={styles.MenuItemText}>
              {role.title}
              {count[key] ? <span>({count[key]})</span> : null}
            </div>
          </div>
        ))}
        <div className="divider" />
        <div
          className={clsx(styles.MenuItem, "readonly")}
          onClick={() => clickHandler("mic", true)}
        >
          Включен микрофон
        </div>
      </Popover>
    </div>
  );
};
