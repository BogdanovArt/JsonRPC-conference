import { Icon } from "@oktell/icons";
import { Input, CalendarPicker } from "@oktell/inputs";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import { Expandable } from "components/common/UI/Expandable";

import { IBasicObject } from "types/index";
import { Filters } from "../types";

import styles from "../../ListsPage/blocks/MobileToolbar.module.scss";

interface Props {
  initialDate?: [string, string];
  selectors: IBasicObject[];
  search?: string;
  filters?: Filters;
  setDate?: (name: string, value?: [string, string]) => void;
  setSearch?: (name: string, query: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  initialDate,
  selectors,
  search,
  filters,
  setDate = () => null,
  setSearch = () => null,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [calendarRefresh, setCalendarRefresh] = useState(Date.now());

  const toggleCalendar = (state?: boolean) => {
    setShowSearch(false);
    setShowCalendar(state || !showCalendar);
  };

  const toggleSearch = (state?: boolean) => {
    setShowCalendar(false);
    setShowSearch(state || !showSearch);
  };

  const chips = useMemo(() => {
    const result: JSX.Element[] = [];
    if (filters?.date) {
      result.push(
        <div
          key="date"
          className={styles.Chip}
          onClick={() => setDate("date", null)}
        >
          {filters?.date} <Icon name="clear" className={styles.ChipIcon} />
        </div>
      );
    }
    if (filters?.search) {
      result.push(
        <div
          key="search"
          className={styles.Chip}
          onClick={() => setSearch("search", "")}
        >
          {filters?.search} <Icon name="clear" className={styles.ChipIcon} />
        </div>
      );
    }
    return result;
  }, [filters]);

  return (
    <div className={styles.Toolbar}>
      <div className={styles.ToolbarControls}>
        <div className={styles.ToolbarTitle}>
          Результаты {selectors?.length ? `(${selectors.length})` : null}
        </div>
        <div
          className={clsx(styles.ToolbarButton, {
            [styles.ToolbarButtonActive]: showCalendar,
          })}
          onClick={() => toggleCalendar()}
        >
          <Icon name="calendar" className={styles.Icon} />
        </div>
        <div
          className={clsx(styles.ToolbarButton, {
            [styles.ToolbarButtonActive]: showSearch,
          })}
          onClick={() => toggleSearch()}
        >
          <Icon name="search" className={styles.Icon} />
        </div>
      </div>

      {chips.length ? <div className={styles.Chips}>{chips}</div> : null}

      <Expandable state={showCalendar}>
        <div className={styles.Calendar}>
          <CalendarPicker
            initial={initialDate}
            selectMode="range"
            onChange={setDate}
            onMonthChange={() => setCalendarRefresh(Date.now())}
          />
        </div>
      </Expandable>

      <Expandable state={showSearch}>
        <div className={styles.ToolbarSearch}>
          <Input
            initial={search}
            placeholder="Поиск"
            after={
              search ? (
                <Icon
                  name="clear"
                  className={clsx(styles.Icon, styles.IconInput)}
                  onClick={() => setSearch("", "")}
                />
              ) : (
                <Icon
                  name="search"
                  className={clsx(styles.Icon, styles.IconInput)}
                />
              )
            }
            onChange={setSearch}
          />
        </div>
      </Expandable>
    </div>
  );
};
