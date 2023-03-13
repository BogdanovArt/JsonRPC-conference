import { useState } from "react";
import reactStringReplace from "react-string-replace";
import { Avatar } from "@oktell/header-panel";
import { format } from "date-fns";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { isMobile, isTablet } from "react-device-detect";
import parseISO from "date-fns/esm/fp/parseISO";

import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { PaginationCustom as Pagination } from "components/common/UI/Pagination";

import { IBasicObject } from "types/index";
import { BreakPoints } from "types/enums";

import { getBreakPoint } from "store/core/getters";

import isDate from "utils/isDate";

import styles from "./DesktopTable.module.scss";

interface Props {
  items: IBasicObject[];
  search?: string;
  rowClick?: (item: IBasicObject) => void;
}

export const renderDate = (dateStart: string, duration?: number) => {
  const dateISO = dateStart + "Z";
  const startDate = parseISO(dateISO);
  const durationTime = duration * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationTime);

  const formatStartDate = isDate(startDate)
    ? format(startDate, "dd-MM-yyyy")
    : "";
  const formatStartDateTime = isDate(startDate)
    ? format(startDate, "HH:mm")
    : "";
  const formatEndDate = isDate(endDate) ? format(endDate, "HH:mm") : "";

  return (
    <div className={styles.TableCellDate}>
      <div className={styles.TableCellDateDay}>{formatStartDate}</div>
      <div
        className={styles.TableCellDateTime}
      >{`${formatStartDateTime}-${formatEndDate}`}</div>
    </div>
  );
};

const renderParticipants = (
  data: IBasicObject[],
  search: string,
  breakpoint: BreakPoints
) => {
  const count = data.length - 3;
  return (
    <div
      className={clsx(styles.TableCellParticipants, {
        [styles.TableCellParticipantsVertical]: isMobile || isTablet,
      })}
    >
      {data.slice(0, 3).map((item: any) => (
        <div key={item.id} className={styles.TableCellParticipantsItem}>
          <Avatar size={24} name={item.name} />
          <div>
            {search
              ? reactStringReplace(item.name, search, (match, index) => (
                  <span
                    key={index}
                    className={styles.TableCellNameSearchActive}
                  >
                    {match}
                  </span>
                ))
              : item.name}
          </div>
        </div>
      ))}

      {count > 0 ? <div>и еще {count}</div> : null}
    </div>
  );
};

export const DesktopTable: React.FC<Props> = ({
  items,
  search,
  rowClick = () => null,
}) => {
  const [pages, onChangePages] = useState({ start: 0, end: 20 });

  const breakpoint = useSelector(getBreakPoint);
  const isTouchDevice = isMobile || isTablet;

  const changePages = (start: number, end: number) => {
    onChangePages({ start, end });
  };

  const rowClickHandler = (item: IBasicObject) => {
    if (isTouchDevice) rowClick(item);
  };

  const rowDoubleClickHandler = (item: IBasicObject) => {
    if (!isTouchDevice) rowClick(item);
  };

  return (
    <>
      <div className={styles.Table}>
        <div className={styles.TableCellHead}>
          <div className={styles.TableRow}>
            <div className={clsx(styles.TableCell, styles.TableCellSmall)}>
              Дата
            </div>
            <div className={clsx(styles.TableCell, styles.TableCellBig)}>
              Название / организатор
            </div>
            <div className={clsx(styles.TableCell, styles.TableCellBig)}>
              Участники
            </div>
          </div>
        </div>
        <ScrollContainer className={styles.ResultsTable}>
          <div className={styles.TableCellBody}>
            {items?.slice(pages.start, pages.end).map((item: any) => (
              <div
                key={item.id}
                onDoubleClick={() => rowDoubleClickHandler(item)}
                onClick={() => rowClickHandler(item)}
                className={styles.TableRow}
              >
                <div className={clsx(styles.TableCell, styles.TableCellSmall)}>
                  {renderDate(item.timestartutc, item.ext.duration_plan)}
                </div>
                <div className={clsx(styles.TableCell, styles.TableCellBig)}>
                  <div
                    className={clsx(styles.TableCellName, {
                      [styles.TableCellNameSearch]: search,
                    })}
                  >
                    {search
                      ? reactStringReplace(
                          item.displayname,
                          search,
                          (match, index) => (
                            <span
                              key={index}
                              className={styles.TableCellNameSearchActive}
                            >
                              {match}
                            </span>
                          )
                        )
                      : item.displayname}
                  </div>
                  <div className={styles.TableCellOwner}>{item.user}</div>
                </div>
                <div className={clsx(styles.TableCell, styles.TableCellBig)}>
                  {item.participants?.length
                    ? renderParticipants(item.participants, search, breakpoint)
                    : null}
                </div>
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
      {items?.length > 20 ? (
        <Pagination itemsCount={items?.length} onChange={changePages} />
      ) : null}
    </>
  );
};
