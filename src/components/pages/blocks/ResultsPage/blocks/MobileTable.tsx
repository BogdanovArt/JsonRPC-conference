import { addLeadingZero } from "@oktell/utils";
import { ScrollContainer } from "components/common/UI/ScrollContainer";
import parseISO from "date-fns/parseISO";
import { useMemo } from "react";
import reactStringReplace from "react-string-replace";

import { SelectorForm } from "store/content/types";
import { IBasicObject } from "types/index";
import { getDurationRange } from "utils/dateConverters";

import { Months } from "../../CalendarPage/consts";

import styles from "./MobileTable.module.scss";

interface Props {
  items: IBasicObject[];
  search?: string;
  rowClick?: (row: IBasicObject) => void;
}

interface GroupDates {
  [key: string]: { [key: string]: SelectorForm[] };
}

export const MobileTable: React.FC<Props> = ({
  items,
  search,
  rowClick = () => null,
}) => {
  const groupedItems = useMemo(() => {
    const grouped: GroupDates = {};
    items.forEach((item, index) => {
      const start = item.timestartutc as string;
      const rawDate = parseISO(start);
      const month = rawDate?.getMonth();
      const monthTitle = `${Months[month]}, ${rawDate?.getFullYear()}`;
      const date = rawDate?.getDate();

      if (!grouped[monthTitle]) {
        grouped[monthTitle] = { [date]: [item] };
      } else if (!grouped[monthTitle][date]) {
        grouped[monthTitle][date] = [item];
      } else {
        grouped[monthTitle][date].push(item);
      }
    });
    return Object.entries(grouped);
  }, [items]);

  return (
    <div className={styles.Table}>
      {groupedItems?.length ? (
        groupedItems.map(([month, dates], index) => (
          <div key={month}>
            <div className={styles.HeaderMonth}>{month}</div>
            <div className={styles.Dates}>
              {Object.entries(dates).reverse().map(([date, items]) => (
                <div key={date} className={styles.Group}>
                  <div className={styles.HeaderDate}>
                    {addLeadingZero(date)}
                  </div>
                  <div className={styles.Selectors}>
                    {items.map((selector, index) => (
                      <div key={selector?.id} className={styles.Selector} onClick={() => rowClick(selector as IBasicObject)}>
                        <div className={styles.SelectorTitle}>
                          {reactStringReplace(
                            selector.displayname,
                            search,
                            (match, index) => (
                              <span
                                key={index}
                                style={{ background: "var(--search-color)" }}
                              >
                                {match}
                              </span>
                            )
                          )}
                        </div>
                        <div className={styles.SelectorDuration}>
                          {getDurationRange(
                            selector.timestartutc,
                            selector.ext.duration_plan
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.Hint}>
          По данному запросу ничего не нашлось...
        </div>
      )}
    </div>
  );
};
