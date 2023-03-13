import { ActionHandler } from "../../SelectorPage/types";
import { EventItem } from "../Calendar";

export interface ButtonProps<T = boolean> {
  name: Keys;
  initial?: T;
  active?: boolean;
  disabled?: boolean;
  tooltips?: [string, string];
  actionHanlder?: ActionHandler;
}

export interface ToastContent {
  text: string;
  icon: string;
}

export type Keys = "dynamic" | "mic" | "recall" | "calltime";

export type ScrollStates = "above" | "below" | "visible";

export type ScrolledEvents = {
  [key: string]: Array<EventItem>;
};
