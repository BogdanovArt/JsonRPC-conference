import { format } from "date-fns";

export const isDate = (data: any) => {
  return data && !isNaN(data) && data instanceof Date;
};

export const download = (
  content: string,
  fileName: string,
  contentType: string,
  blob?: Blob
) => {
  const a = document.createElement("a");
  const file = blob || new Blob([content], { type: contentType });
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  a.click();
};

export const getFormattedDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const getHoursFromDate = (date: string) => {
  const chunks = date.split("-");
  return `${chunks[2]}.${chunks[1]}`;
};
