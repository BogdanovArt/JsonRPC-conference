import { CalendarViews } from "types/enums";
import { InputBase } from "../types";

export interface DatePickerProps extends InputBase<string> {
  view?: CalendarViews;
}
