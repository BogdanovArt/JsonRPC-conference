import styled, { css } from "styled-components";

import { CalendarViews } from "types/enums";

const Today = css`
  color: #fff !important;
  font-weight: 600;
  &:after {
    content: "";
    position: absolute;
    background-color: var(--calendar-active);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    z-index: 1;
  }
`;

const Active = css`
  &::before {
    content: "";
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: var(--bg-other);
  }
`;

interface DayProps {
  today?: boolean;
  active?: boolean;
  view?: CalendarViews;
}

export const Day = styled.div<DayProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: var(--text-color);
  text-align: center;
  font-size: 14px;
  font-family: var(--secondary-font);
  user-select: none;
  &:hover {
    color: var(--calendar-active);
    /* background-color: var(--bg-secondary); */
  }
  ${({ today }) => (today ? Today : "")}
  ${({ active }) => (active ? Active : "")}
`;

export const Date = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 35px;
  color: inherit;
  position: relative;
  z-index: 2;
`;
