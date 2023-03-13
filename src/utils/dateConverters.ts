import Format from "date-fns/format";
import formatISO from "date-fns/formatISO";
import Ru from "date-fns/locale/ru";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";

export const getDateFromString = (date: string = "") => {
  const [dateString, timeString] = date?.split(" ");
  return [getLocalDate(dateString) || "", getLocalTime(timeString) || null];
};

export const getLocalTime = (timeString: string) => {
  if (!timeString) return "";
  const globalDateString = formatISO(getDateFromTime(timeString));
  const localDateString = globalDateString.split("+")[0] + "Z";
  const localDate = parseISO(localDateString);
  return Format(localDate, "HH:mm");
};

export const getLocalDateStringFromISOString = (
  globalDateString: string,
  format?: string
): Date | string => {
  if (!globalDateString) return;
  const globalDate = parseISO(globalDateString + "Z");
  return format ? Format(globalDate, format) : globalDate;
};

export const getDateFromTime = (time: string): Date => {
  const [h, m] = time.split(":");
  const dateISOString = `1970-01-01T${h}:${m}`;
  return parseISO(dateISOString);
};

export const getReadableDuration = (start: Date, end: Date) => {
  const delta = start.getTime() - end.getTime();
  if (delta <= 0) return null;
  const deltaMins = delta / (1000 * 60);
  return getDurationString(deltaMins);
};

export const getDurationString = (durationMins: number) => {
  if (durationMins <= 0) return null;
  const hours = durationMins / 60;
  const minutes = durationMins % 60;
  if (hours >= 1) {
    return `${Math.floor(hours)}ч.${minutes ? " " + minutes + "мин." : ""}`;
  } else {
    return `${minutes}мин.`;
  }
};

export const getDurationRange = (start: string, durationMinutes: number) => {
  try {
    const startDate = getLocalDateStringFromISOString(start) as Date;
    if (!durationMinutes) return Format(startDate, "HH:mm");

    const startDateTime = startDate.getTime();
    const endTime = startDateTime + durationMinutes * 60 * 1000;
    const endDate = new Date(endTime);
    return `${Format(startDate, "HH:mm")} - ${Format(endDate, "HH:mm")}`;
  } catch (error) {
    console.warn("error");
  }
};

export const getLocalDate = (
  date: string | Date,
  format = "yyyy-MM-dd",
  raw?: boolean
) => {
  let source = date;
  if (typeof date !== "string") {
    const globalDateString = formatISO(date);
    const localDateString = globalDateString.split("+")[0];
    source = localDateString;
  }

  if (!source) return "";

  const globalDateISOString = source + "Z";
  try {
    const localDate = parseISO(globalDateISOString);
    return raw ? localDate : Format(localDate, format, { locale: Ru });
  } catch (error) {
    console.warn(error);
    return "";
  }
};

export const getGlobalDate = (
  date: string | Date,
  format: string = "yyyy-MM-dd HH:mm"
) => {
  try {
    if (!date) return "";

    let source;
    if (typeof date !== "string") {
      source = formatISO(date);
    } else {
      source = date;
    }

    const globalDateString = parseISO(source).toUTCString().replace(" GMT", "");
    const globalDate = new Date(globalDateString);
    return Format(globalDate, format);
  } catch (error) {
    console.warn(error);
    return "";
  }
};
