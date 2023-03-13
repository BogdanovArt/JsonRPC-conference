import React, {
  ComponentType,
  HTMLAttributes,
  useContext,
  useMemo,
} from "react";

import {
  WeekView,
  DayView,
  Appointments,
  AppointmentTooltip,
  MonthView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { BaseView } from "@devexpress/dx-react-scheduler";
import Format from "date-fns/format";

import { IntersectionObserverWrapper } from "./blocks/IntersectionWrapper";
import { ScrollContainer } from "components/common/UI/ScrollContainer";

import { EventProps } from "./blocks/Events/types";
import { EventComponent } from "./blocks/Events/Events";

import { CalendarViews } from "types/enums";
import { ActionHandler } from "components/pages/blocks/SelectorPage/types";
import { ScrolledEvents, ScrollStates } from "./blocks/types";

import { DaysShort } from "./consts";
import { EventItem, ScrollContext } from "./Calendar";

import styles from "./Calendar.module.scss";

// @TODO переделать иерархию компонентов + стили;

export const Root: React.FC = ({ children }) => {
  return <div className={styles.BG}>{children}</div>;
};

export const DayViewCell: ComponentType<DayView.DayScaleCellProps> = (
  props
) => {
  const day = props.startDate.getDay();
  const date = props.startDate.getDate();

  const id = Format(props.startDate, "yyyy-MM-dd");
  const ctx = useContext(ScrollContext);
  const scrolled = ctx[id]?.[0];

  const scroller = (id: string) => {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <td>
      <div className={styles.Day}>
        <span className={styles.DayWeek}>{DaysShort[day]},</span>

        <span className={props.today ? styles.DayToday : ""}>{date}</span>

        {scrolled ? (
          <span
            className={styles.WeekCellScrolled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scroller(scrolled.id);
            }}
          >
            {scrolled.title}
          </span>
        ) : null}
      </div>
    </td>
  );
};

type DayListType = ComponentType<DayListProps>;

type DayListProps = DayView.DayScaleCellProps & {
  selectDayView?: (day: string, view: CalendarViews) => void;
};

export const DayListView: DayListType = ({ selectDayView, ...props }) => {
  const day = props.startDate.getDay();
  const date = props.startDate.getDate();

  const id = Format(props.startDate, "yyyy-MM-dd");
  const ctx = useContext(ScrollContext);
  const scrolled = ctx[id]?.[0];

  const scroller = (id: string) => {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <td
      id={id}
      className={styles.HeadCell}
      onClick={() => selectDayView(`${props.startDate}`, "Day")}
    >
      <div data-scrolled="2" className={styles.WeekCell}>
        <span className={styles.WeekCellDay}>
          {DaysShort[day]}
          <span className="comma">,</span>
        </span>

        <span
          className={[
            props.today ? styles.WeekCellToday : "",
            day === 0 || day === 6 ? styles.WeekCellWeekend : "",
          ].join(" ")}
        >
          {date}
        </span>

        {scrolled ? (
          <span
            className={styles.WeekCellScrolled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scroller(scrolled.id);
            }}
          >
            {scrolled.title}
          </span>
        ) : null}
      </div>
    </td>
  );
};

export const TimeTable: ComponentType<WeekView.TimeTableLayoutProps> = (
  props
) => {
  return <WeekView.TimeTableLayout {...props} cellComponent={TimeTableCell} />;
};

type TimeTableCellType = ComponentType<TimeTableCellProps>;
type TimeTableCellProps = WeekView.TimeTableCellProps & {
  createNewSelector?: (date?: Date) => void;
};

export const TimeTableCell: TimeTableCellType = ({
  createNewSelector,
  ...props
}) => {
  return (
    <WeekView.TimeTableCell
      onClick={() => createNewSelector(props.startDate)}
      {...props}
      className={styles.Cell}
    />
  );
};

export const TimeScale: ComponentType<WeekView.TimeScaleLayoutProps> = (
  props
) => {
  const cells = props.cellsData?.map(
    (row: BaseView.CellData[], ind: number) => {
      const cell = row[0];
      return (
        <TimeScaleLabel
          key={ind}
          time={cell.startDate}
          formatDate={props.formatDate}
        />
      );
    }
  );
  return <div className={styles.TimeScale}>{cells}</div>;
};

export const TimeScaleLabel: ComponentType<WeekView.TimeScaleLabelProps> = (
  props
) => {
  return (
    <WeekView.TimeScaleLabel {...props} className={styles.TimeScaleCell} />
  );
};

export const DayScale: ComponentType<WeekView.DayScaleLayoutProps> = (
  props
) => {
  return (
    <WeekView.DayScaleLayout {...props} className={styles.WeekLayoutDays} />
  );
};

type WeekLayoutType = ComponentType<WeekLayoutProps>;
type WeekLayoutProps = WeekView.LayoutProps & {
  current?: Date;
  timeScaleComponent: ComponentType<WeekView.TimeScaleLayoutProps>;
};

export const WeekLayout: WeekLayoutType = ({
  current,
  dayScaleComponent,
  timeScaleComponent,
  timeTableComponent,
}) => {
  const dayScale = dayScaleComponent as React.FC<WeekView.DayScaleLayoutProps>; // no docs for 2.7.6, type collision with current documentation;
  const timeScale =
    timeScaleComponent as React.FC<WeekView.TimeScaleLayoutProps>;
  const timeTable =
    timeTableComponent as React.FC<WeekView.TimeTableLayoutProps>;

  return (
    <div className={styles.WeekLayout}>
      <div className={styles.WeekLayoutDaysWrap}>{dayScale.call(DayScale)}</div>
      <div className={styles.WeekLayoutWorkspace}>
        <ScrollContainer className={styles.WeekLayoutWorkspaceGrid}>
          {timeScale.call(TimeScale)}
          <div className={styles.TimeTable}>{timeTable.call(TimeTable)}</div>
        </ScrollContainer>
      </div>
    </div>
  );
};

export const DayLayout: ComponentType<
  DayView.LayoutProps & {
    scrolled?: ScrolledEvents;
    timeScaleComponent?: ComponentType<WeekView.TimeScaleLayoutProps>;
  }
> = ({
  dayScaleComponent,
  timeScaleComponent,
  timeTableComponent,
  scrolled,
}) => {
  const dayScale = dayScaleComponent as React.FC<DayView.DayScaleLayoutProps>; // no docs for 2.7.6, type collision with current documentation;
  const timeScale =
    timeScaleComponent as React.FC<DayView.TimeScaleLayoutProps>;
  const timeTable =
    timeTableComponent as React.FC<DayView.TimeTableLayoutProps>;

  const DayScale = useMemo(
    () => <div className={styles.DayLayoutDayScale}>{dayScale.call({})}</div>,
    [scrolled]
  );
  const Workspace = useMemo(
    () => (
      <div className={styles.WeekLayoutWorkspace}>
        <ScrollContainer className={styles.WeekLayoutWorkspaceGrid}>
          {timeScale.call(TimeScale)}
          <div className={styles.TimeTable}>{timeTable.call(TimeTable)}</div>
        </ScrollContainer>
      </div>
    ),
    []
  );
  return (
    <div className={styles.DayLayout}>
      {DayScale}
      {Workspace}
    </div>
  );
};

type MonthViewType = ComponentType<MonthViewProps>;

type MonthViewProps = MonthView.TimeTableCellProps & {
  selectDayView?: (day: string, view: CalendarViews) => void;
};

export const MonthCell: MonthViewType = ({ selectDayView, ...props }) => {
  const day = props.startDate.getDay();
  const date = props.startDate.getDate();
  return (
    <td className={styles.MonthLayoutCell}>
      <div className={styles.MonthLayoutCellContent}>
        <span
          className={styles.MonthCellDayWrap}
          onClick={() => selectDayView(`${props.startDate}`, "Day")}
        >
          <span className={styles.MonthCellDay}>{DaysShort[day]},</span>
          <span
            className={[
              props.today ? styles.WeekCellToday : "",
              day === 0 || day === 6 ? styles.WeekCellWeekend : "",
            ].join(" ")}
          >
            {date}
          </span>
        </span>
      </div>
    </td>
  );
};

export const MonthDayScale: ComponentType<MonthView.DayScaleLayoutProps> = (
  props
) => {
  return (
    <MonthView.DayScaleLayout {...props} className={styles.MonthLayoutDays} />
  );
};

export const MonthLayout: ComponentType<MonthView.LayoutProps> = ({
  dayScaleComponent,
  timeTableComponent,
}) => {
  const dayScale = dayScaleComponent as React.FC<MonthView.DayScaleLayoutProps>; // no docs for 2.7.6, type collision with current documentation;
  const timeTable =
    timeTableComponent as React.FC<MonthView.TimeTableLayoutProps>; // @TODO write a type adapter for desynced props
  return (
    <ScrollContainer className="MonthLayoutScrollContainer">
      <div className={styles.MonthLayout}>
        {dayScale.call(MonthDayScale)}
        <div className={styles.TimeTable}>{timeTable.call({})}</div>
      </div>
    </ScrollContainer>
  );
};

export const DateNavButton = (
  props: { type: string } & HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div className={styles.ToolbarButton} onClick={props.onClick}>
      <img
        src="svg/arrow.svg"
        alt={`navigation icon ${props.type}`}
        className={props.type}
      />
    </div>
  );
};

interface WeekProps {
  excluded: number[];
  current?: Date;
  selectDayView?: (day: string, view: CalendarViews) => void;
  createNewSelector?: (date?: Date) => void;
}

export const Week = ({
  excluded,
  current,
  selectDayView,
  createNewSelector,
}: WeekProps) => {
  return (
    <WeekView
      cellDuration={60}
      startDayHour={8}
      endDayHour={24}
      excludedDays={excluded}
      dayScaleLayoutComponent={DayScale}
      timeScaleLayoutComponent={TimeScale}
      dayScaleCellComponent={(props) => (
        <DayListView selectDayView={selectDayView} {...props} />
      )}
      timeTableCellComponent={(props) => (
        <TimeTableCell createNewSelector={createNewSelector} {...props} />
      )}
      layoutComponent={WeekLayout}
    />
  );
};

interface MonthProps {
  selectDayView?: (day: string, view: CalendarViews) => void;
}

export const Month = ({ selectDayView }: MonthProps) => {
  return (
    <MonthView
      dayScaleLayoutComponent={MonthDayScale}
      dayScaleCellComponent={() => null}
      timeTableCellComponent={(props) => (
        <MonthCell selectDayView={selectDayView} {...props} />
      )}
      layoutComponent={MonthLayout}
    />
  );
};

interface DayProps {
  scrolled?: ScrolledEvents;
  createNewSelector?: (date?: Date) => void;
}

export const Day = ({ scrolled, createNewSelector }: DayProps) => {
  return (
    <DayView
      startDayHour={7}
      cellDuration={60}
      layoutComponent={(props) => <DayLayout {...props} />}
      timeScaleLayoutComponent={TimeScale}
      timeTableCellComponent={(props) => (
        <DayView.TimeTableCell
          onClick={() => createNewSelector(props.startDate)}
          {...props}
          className={styles.Cell}
        />
      )}
      dayScaleCellComponent={DayViewCell}
    />
  );
};

export const TimeIndicator = () => {
  return (
    <div className={styles.DayIndicator}>
      <div className={styles.DayIndicatorCircle}></div>
      <div className={styles.DayIndicatorLine}></div>
    </div>
  );
};

export const EventView = ({
  type,
  search,
  actionHandler,
  eventClick,
  scrollHandler = () => null,
}: {
  type: string;
  search?: string;
  actionHandler?: ActionHandler;
  eventClick: (event: EventItem) => void;
  scrollHandler: (state: ScrollStates, event: EventItem) => void;
}) => {
  if (type === "Month") {
    return (
      <Appointments
        appointmentComponent={(props: EventProps) => (
          <EventComponent
            type={type}
            search={search}
            eventClick={eventClick}
            actionHandler={actionHandler}
            {...props}
          />
        )}
      />
    );
  }
  return (
    <Appointments
      appointmentComponent={(props: EventProps) => (
        <IntersectionObserverWrapper
          onScrolledUp={() => scrollHandler("above", props.data as EventItem)}
          onScrolledDown={() => scrollHandler("below", props.data as EventItem)}
          onVisible={() => scrollHandler("visible", props.data as EventItem)}
        >
          <EventComponent
            search={search}
            eventClick={eventClick}
            actionHandler={actionHandler}
            {...props}
          />
        </IntersectionObserverWrapper>
      )}
    />
  );
};

export const EventDetailHeader: ComponentType<
  AppointmentTooltip.HeaderProps
> = (props) => {
  return (
    <AppointmentTooltip.Header {...props} className={styles.TooltipHeader}>
      <div className={styles.TooltipAction}>
        <button className={styles.TooltipActionButton}>Скопировать</button>
        <button className={styles.TooltipActionButton}>Редактировать</button>
        <button className={styles.TooltipActionButton}>Удалить</button>
      </div>
      <button className={styles.TooltipActionClose}>
        <img src="svg/close.svg" alt="Close" />
      </button>
    </AppointmentTooltip.Header>
  );
};
