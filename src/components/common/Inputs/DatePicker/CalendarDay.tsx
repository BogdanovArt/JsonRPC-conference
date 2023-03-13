import { isSameDay, isSameMonth, isSameWeek, isToday } from "date-fns";
import { CalendarViews } from "types/enums";

import { Day as StyledDay, Date as StyledDate } from "./CalendarDayStyles";

interface Props {
  date: Date;
  selected?: Date;
  view?: CalendarViews;
  onDayClick?: (date: Date, state: boolean) => void;
}

export const Day: React.FC<Props> = ({
  date,
  selected,
  view,
  onDayClick = () => null,
}) => {
  const clickHandler = (date: Date) => {
    onDayClick(date, false);
  };

  const dayIsToday = isToday(date);

  const isActive = () => {
    switch (view) {
      case "Month":
        return isSameMonth(selected, date);
      case "Week":
        return isSameWeek(selected, date, { weekStartsOn: 1 });
      default:
        return isSameDay(selected, date);;
    }
  };

  return (
    <StyledDay
      view={view}
      today={dayIsToday}
      active={isActive()}
      onClick={() => clickHandler(date)}
    >
      <StyledDate>{date.getDate()}</StyledDate>
    </StyledDay>
  );
};
