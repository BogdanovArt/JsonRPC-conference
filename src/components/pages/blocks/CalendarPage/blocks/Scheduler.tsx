import { useCallback, useMemo, useState } from "react";
import {
  Scheduler,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";

import { EventItem } from "../Calendar";
import { Root, Day, Week, Month, TimeIndicator, EventView } from "../Parts";

import { CalendarViews } from "types/enums";
import { ActionHandler } from "../../SelectorPage/types";
import { ScrolledEvents, ScrollStates } from "./types";

interface Props {
  items: EventItem[];
  view: CalendarViews;
  current: string;
  searchValue: string;
  scrolled: ScrolledEvents;
  handleEventScroll: (state: ScrollStates, event: EventItem) => void;
  setCurrent: (current: string) => void;
  selectDayView: (day: string, view: CalendarViews) => void;
  handleModal: (item: EventItem | null) => Promise<void>;
  actionHandler: ActionHandler;
  createNewSelector?: (date?: Date) => void;
}

export const CalendarScheduler: React.FC<Props> = ({
  items = [],
  view,
  current,
  searchValue,
  setCurrent,
  selectDayView,
  actionHandler,
  handleModal,
  handleEventScroll,
  createNewSelector,
}) => {
  const EventMemo = useMemo(
    () => (
      <EventView
        search={searchValue}
        type={view}
        eventClick={handleModal}
        actionHandler={actionHandler}
        scrollHandler={handleEventScroll}
      />
    ),
    [view, current, searchValue]
  );

  const ViewStateMemo = useMemo(
    () => (
      <ViewState
        currentViewName={view}
        currentDate={current}
        onCurrentDateChange={(date) => setCurrent(date.toString())}
      />
    ),
    [current, view]
  );

  const CurrentTimeMemo = useMemo(
    () => <CurrentTimeIndicator indicatorComponent={TimeIndicator} />,
    []
  );

  const MonthMemo = useMemo(() => <Month selectDayView={selectDayView} />, []);
  const DayMemo = useMemo(
    () => <Day createNewSelector={createNewSelector} />,
    []
  );
  const WeekMemo = useMemo(
    () => (
      <Week
        excluded={[]}
        current={new Date(current)}
        selectDayView={selectDayView}
        createNewSelector={createNewSelector}
      />
    ),
    [current]
  );

  return (
    <Scheduler
      firstDayOfWeek={1}
      locale={"ru-RU"}
      data={items}
      rootComponent={Root}
    >
      {ViewStateMemo}
      {WeekMemo}
      {DayMemo}
      {MonthMemo}
      {EventMemo}
      {CurrentTimeMemo}
    </Scheduler>
  );
};
