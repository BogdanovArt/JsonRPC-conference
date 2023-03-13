import React from "react";
import { BreakPoints, CalendarViews } from "types/enums";

export const Days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const DaysShort = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const Months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const DMonths = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];

export const Views: { [key in CalendarViews]?: string } = {
  Day: "День",
  Week: "Неделя",
  Month: "Месяц",
};

export const ViewTypes: Array<{ key: CalendarViews; title: string }> = [
  {
    key: "Day",
    title: "День",
  },
  {
    key: "Week",
    title: "Неделя",
  },
  {
    key: "Month",
    title: "Месяц",
  },
];

export const SlideStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  width: 440,
  right: 0,
  top: 42,
  zIndex: 52,
};

export const SlideMobileStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  width: "100%",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 53,
  background: "var(--bg-primary)",
};

export const SlideTabletStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  width: 440,
  top: 0,
  bottom: 0,
  right: 0,
  zIndex: 51,
  background: "var(--bg-primary)",
};

export const ModalStyles: { [key in BreakPoints]: React.CSSProperties } = {
  xl: SlideStyles,
  lg: SlideTabletStyles,
  md: SlideTabletStyles,
  xs: SlideMobileStyles,
};
