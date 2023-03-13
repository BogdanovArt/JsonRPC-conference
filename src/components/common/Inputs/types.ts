import { PopOptions } from "components/pages/blocks/SelectorPage/types";
import { IBasicObject, RequestPayload } from "types/index";

export enum InputTypes {
  checkbox = "input-checkbox",
  switchbox = "input-switchbox",
  text = "input-text",
  date = "input-date-picker",
  time = "input-time-picker",
  select = "input-select",
  async = "input-async"
}
export type EventTypes = "manual" | "auto" | undefined;
export type onChange<T> = (name: string, value?: T, type?: EventTypes) => void;

export interface InputBase<ReturnType = string> {
  name?: string;
  initial?: ReturnType;
  disabled?: boolean;
  label?: string;
  onChange?: onChange<ReturnType>;
}

export interface TextInputProps extends InputBase {
  placeholder?: string;
  before?: JSX.Element;
  after?: JSX.Element;
  emptyValue?: string;
  dimmed?: boolean;
  centered?: boolean;
  allowedCharacters?: string;
  onEnter?: onChange<string>;
  className?: string;
}

export interface SearchInputProps extends InputBase{}

export interface DatePickerProps extends InputBase {}

export interface TimePickerProps extends InputBase {
  step?: number;
}

export interface DropDownItem<R> {
  title: string;
  value: R;
}

export interface DropDownProps extends InputBase<string | number> {
  placeholder?: string;
  titleKey?: string;
  valueKey?: string;
  subtitleKey?: string;
  compact?: boolean;
  slim?: boolean;
  menu?: boolean;
  time?: boolean;
  items: IBasicObject[];
  popoptions?: PopOptions;
}

export interface AsyncInputProps extends InputBase<IBasicObject[]> {
  placeholder?: string;
  visibleKeys?: string[];
  request?: (pl: RequestPayload) => Promise<any>;
}

export interface CheckBoxProps extends InputBase<boolean> {
  big?: boolean;
  reverse?: boolean;
  days?: boolean;
}

export interface RadioButtonProps extends InputBase<boolean> {
  value?: string;
  icon?: boolean;
  iconView?: string;
  readonlyRadio?: boolean;
}

export interface SwitchBoxProps extends InputBase<boolean> {
  reverse?: boolean;
}

export interface NumberInputProps extends InputBase<number> {
    dimmed?: boolean;
    step?: number;
    width?: number | "auto";
    max?: number;
    min?: number;
}

export interface InputBlock {
  type: InputTypes;
  options: InputItem;
}

export type InputItem =
  | TextInputProps
  | DatePickerProps
  | TimePickerProps
  | DropDownProps
  | AsyncInputProps
  | SwitchBoxProps
  | NumberInputProps
  | CheckBoxProps;
