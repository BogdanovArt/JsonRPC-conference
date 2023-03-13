import { Icon } from "@oktell/icons";
import { Input, CalendarPicker } from "@oktell/inputs";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import { Expandable } from "components/common/UI/Expandable";

import { IBasicObject } from "types/index";
import { CalendarViews } from "types/enums";
import { Filters } from "../../ResultsPage/types";

import styles from "../../ListsPage/blocks/MobileToolbar.module.scss";

interface Props {
  initialDate?: [string, string];
  selectors: IBasicObject[];
  search?: string;
  filters?: Filters;
  view: CalendarViews;
  title?: string;
  setView?: (view: CalendarViews) => void;
  setDate?: (name: string, value?: [string, string]) => void;
  setSearch?: (name: string, query: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  initialDate,
  selectors,
  search,
  filters,
  view,
  title = "Календарь",
  setView = () => null,
  setDate = () => null,
  setSearch = () => null,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
        <div className={styles.ToolbarTitle}>{title}</div>
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
        <div className={clsx(styles.Calendar, "SelectorCalendar")}>
          <div className={styles.CalendarViews}>
            <div
              className={clsx(styles.CalendarButton, {
                [styles.CalendarButtonActive]: view === "Day",
              })}
              onClick={() => setView("Day")}
            >
              <Icon name="calendarday" className={styles.Icon} />
              <span>день</span>
            </div>
            <div
              className={clsx(styles.CalendarButton, {
                [styles.CalendarButtonActive]: view === "Week",
              })}
              onClick={() => setView("Week")}
            >
              <Icon name="calendarweek" className={styles.Icon} />
              <span>неделя</span>
            </div>
            <div
              className={clsx(styles.CalendarButton, {
                [styles.CalendarButtonActive]: view === "Month",
              })}
              onClick={() => setView("Month")}
            >
              <Icon name="calendarmonth" className={styles.Icon} />
              <span>месяц</span>
            </div>
          </div>
          {/* <CalendarPicker initial={initialDate} onChange={setDate} /> */}
        </div>
      </Expandable>

      <Expandable state={showSearch}>
        <div className={clsx(styles.ToolbarSearch, "SelectorSearch")}>
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
