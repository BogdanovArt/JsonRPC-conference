import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import Slide from "@material-ui/core/Slide";
import { Portal } from "@oktell/header-panel";
import { CalendarPicker } from "@oktell/inputs";
import { isMobile, isTablet } from "react-device-detect";

import { Search } from "components/common/Inputs/Search";
import { CalendarModal } from "../CalendarPage/CalendarModal";
import { Toolbar } from "./blocks/MobileToolbar";
import { DesktopTable } from "./blocks/DesktopTable";
import { MobileTable } from "./blocks/MobileTable";

import { IBasicObject, RequestPayloadOptions } from "types/index";
import { ActionTypes } from "types/enums";
import { GenericAction } from "store/content/types";
import { ActionHandler, Selector } from "../SelectorPage/types";

import { requestContentData, requestLocalData } from "store/content/actions";

import { ArchivedActions } from "utils/consts";
import { getHoursFromDate } from "utils/index";
import { getLocalDate } from "utils/dateConverters";
import { actionCreator } from "../SelectorPage/utils";
import {
  ModalStyles,
  SlideMobileStyles,
  SlideStyles,
  SlideTabletStyles,
} from "../CalendarPage/consts";

import { AppDispatch } from "store/index";
import { getBreakPoint } from "store/core/getters";
import { Filters } from "./types";

import commonStyles from "components/layout/Default.module.scss";
import modalStyles from "components/pages/blocks/CalendarPage/blocks/CalendarModal/Slide.module.scss";
import styles from "./Results.module.scss";

// @TODO - add long-touch selector modal event

interface Props {
  children?: JSX.Element | JSX.Element[];
  content: IBasicObject[];
}

export const ResultsPage = ({ children, content }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const contentSort = useMemo(() => {
    return content
      ? [...content]
          .sort((prev, next) => {
            const convertedDatePrev = new Date(prev.timestartutc as string);
            const convertedDateNext = new Date(next.timestartutc as string);
            const getPrevDate = !isNaN(convertedDatePrev.getTime())
              ? convertedDatePrev.getTime()
              : 0;
            const getNextDate = !isNaN(convertedDateNext.getTime())
              ? convertedDateNext.getTime()
              : 0;
            return getPrevDate - getNextDate;
          })
          .reverse()
      : [];
  }, [content]);

  const [filterName, setFilterName] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectorModal, setSelectorModal] = useState(null);

  const onChangeValue = (name: string, value?: string) => {
    setFilterName(value);
  };

  const onDateSelect = (name: string, value?: [string, string]) => {
    switch (true) {
      case !value:
        setFilterStart("");
        setFilterEnd("");
        break;
      default:
        setFilterStart(value[0]);
        setFilterEnd(value[1]);
        break;
    }
  };

  const filterTable = (rows?: IBasicObject[]) => {
    return rows
      ? rows.filter((row) => {
          const name = row.displayname as string;
          const date = getLocalDate(
            row.timestartutc as string,
            "yyyy-MM-dd HH:mm"
          );
          const users = Array.isArray(row.participants)
            ? (row.participants as IBasicObject[])
            : [];

          return (
            (nameFilter(name) || userFilter(users)) &&
            startFilter(date as string) &&
            endFilter(date as string)
          );
        })
      : [];
  };

  const nameFilter = (name: string) => {
    if (!nameFilter) return true;
    return name.toLowerCase().includes(filterName);
  };

  const userFilter = (users: IBasicObject[]) => {
    if (!userFilter) return true;
    const match = users.find((user) => {
      const name = user.name as string;
      const number = user.number as string;
      return (
        name.toLowerCase().includes(filterName) || number.includes(filterName)
      );
    });
    return !!match;
  };

  const startFilter = (start: string) => {
    if (!start || !filterStart) return true;

    const startTime = Date.parse(start);
    const filterTime = Date.parse(filterStart);

    return filterTime <= startTime;
  };

  const endFilter = (end: string) => {
    if (!end || !filterEnd) return true;

    const endTime = Date.parse(end);
    const filterTime = Date.parse(filterEnd) + 23.99 * 3600 * 1000; // compare the whole day from 00:00:00 to 23:59:59

    return filterTime >= endTime;
  };

  const rowClickHandler = async (row: IBasicObject) => {
    const Action = ArchivedActions.dbclick;

    const options: RequestPayloadOptions = {
      [Action.payloadKey]: {
        id: row.id,
      },
    };

    let pl: GenericAction = {
      action: Action?.action || ActionTypes.get,
      entity: Action?.entity,
      options,
    };

    const res = await dispatch(requestLocalData(pl));
    if (res?.success) {
      setSelectorModal((res.data as { selector: Selector }).selector);
    }
  };

  const actionHandler: ActionHandler = async (action, payload) => {
    const ACTION = ArchivedActions.dbclick;
    const requestPayload = actionCreator({ action: ACTION, payload });
    const res = await dispatch(requestContentData(requestPayload));
  };

  const filteredContent = filterTable(contentSort).sort((a, b) => {
    const timeA = Date.parse(a.timestartutc as string);
    const timeB = Date.parse(b.timestartutc as string);
    if (!a.timestartutc) return 2;
    if (timeA < timeB) return 1;
    return -1;
  });

  const initialCalendar = useMemo(
    () => [filterStart, filterEnd] as [string, string],
    [filterStart, filterEnd]
  );

  const activeFilters = useMemo((): Filters => {
    const filters: Filters = {};
    if (filterStart) {
      filters.date = getHoursFromDate(filterStart);
    }
    if (filterEnd && filterEnd !== filterStart) {
      filters.date = `${getHoursFromDate(filterStart)} - ${getHoursFromDate(
        filterEnd
      )}`;
    }
    if (filterName) {
      filters.search = filterName;
    }
    return filters;
  }, [filterName, filterEnd, filterStart]);

  const slideStyles = useMemo(() => {
    switch (true) {
      case isTablet || breakpoint === "lg":
        return SlideTabletStyles;
      case isMobile:
        return SlideMobileStyles;
      default:
        return SlideStyles;
    }
  }, [breakpoint]);

  useEffect(() => {
    if (selectorModal) setShowModal(true);
  }, [selectorModal]);

  useEffect(() => {
    setShowModal(false);
  }, [breakpoint]);

  const isModalPorted = ["lg", "md", "xs"].includes(breakpoint) || isTouchDevice;

  const renderModalWrapper = (content: JSX.Element) => {
    return isModalPorted ? (
      <Portal id="header-modal">{content}</Portal>
    ) : (
      content
    );
  };

  return (
    <div
      className={clsx(
        commonStyles.Grid,
        commonStyles[`Grid-${breakpoint}`],
        styles[`Content-${breakpoint}`]
      )}
    >
      {isDesktop ? (
        <div className={styles.Sidebar}>
          <div className={styles.Date}>
            <CalendarPicker
              initial={initialCalendar}
              selectMode="range"
              onChange={onDateSelect}
            />
          </div>
        </div>
      ) : (
        <Toolbar
          selectors={filteredContent}
          initialDate={initialCalendar}
          filters={activeFilters}
          setDate={onDateSelect}
          setSearch={onChangeValue}
        />
      )}
      {isDesktop ? (
        <div className={styles.Results}>
          <div className={styles.Toolbar}>
            <h1 className={styles.Title}>
              Результаты
              <span className={styles.TitleCount}>
                {" "}
                ({filteredContent?.length})
              </span>
            </h1>
            <Search onChange={onChangeValue} />
          </div>

          <DesktopTable
            items={filteredContent}
            search={filterName}
            rowClick={rowClickHandler}
          />
        </div>
      ) : (
        <MobileTable
          items={filteredContent}
          search={filterName}
          rowClick={rowClickHandler}
        />
      )}

      {renderModalWrapper(
        <Slide
          direction="left"
          in={showModal}
          style={{ ...slideStyles, top: !isModalPorted ? 70 : 0 }}
        >
          <div
            className={clsx(
              styles.Slide,
              modalStyles[`SelectorModal-${breakpoint}`],
              { [modalStyles.SelectorModalMobile]: isTouchDevice }
            )}
          >
            {selectorModal ? (
              <CalendarModal
                readonly
                data={selectorModal}
                onClose={setShowModal}
                actionHandler={actionHandler}
                className="ModalContent"
              />
            ) : null}
          </div>
        </Slide>
      )}
    </div>
  );
};
