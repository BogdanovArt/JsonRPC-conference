import { differenceInMinutes } from "date-fns";
import addMinutes from "date-fns/addMinutes";
import Format from "date-fns/format";

import { SelectorForm } from "store/content/types";
import { IBasicObject } from "types/index";
import { getGlobalDate, getLocalDate } from "utils/dateConverters";
import { FormKeys } from "../TemplateModal/enums";

interface SelectorTimes {
  selector: SelectorForm;
  accumulator: IBasicObject;
  startDate: string;
  startTime: string;
  endTime?: string;
  durationMins?: number;
}

export const extractTimeValuesFromSelector = (
  selector: SelectorForm
): string[] => {
  const startDate = getLocalDate(
    selector.timestartutc,
    undefined,
    true
  ) as Date;
  let endDate = new Date(startDate);
  const duration = selector.ext.duration_plan;
  if (duration) endDate = addMinutes(endDate, duration);

  return [
    Format(startDate, "yyyy-MM-dd"),
    Format(startDate, "HH:mm"),
    Format(endDate, "HH:mm"),
  ];
};

export const injectTimeValuesInSelector = ({
  selector,
  accumulator,
  startDate,
  startTime,
  endTime,
  durationMins = 30,
}: SelectorTimes) => {
  const localStartDate = `${startDate} ${startTime}`;
  const globalStartDate = getGlobalDate(localStartDate);

  if (!globalStartDate) return;

  const globalEndDate = new Date(globalStartDate);
  addMinutes(globalEndDate, durationMins);
  
  let duration = durationMins;
  if (endTime) {
    const localEndDate = `${startDate} ${endTime}`;
    duration = Math.abs(differenceInMinutes(new Date(localStartDate), new Date(localEndDate)));
  }

  const ext = { ...selector.ext };
  ext.duration_plan = duration;

  accumulator[FormKeys.timeStartUTC] = globalStartDate;
  accumulator.ext = ext;
  return accumulator;
};
