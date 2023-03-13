import { ModalData, TemplateForm } from "store/content/types";
import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  EntityTypes,
  RequestCodes,
  SelectorTabs,
} from "./enums";

export interface RequestPayload {
  entity: EntityTypes;
  action: ActionTypes;
  options: RequestPayloadOptions;
}

export interface RequestPayloadOptions {
  code?: RequestCodes;
  template?: IBasicObject | TemplateForm;
  templates?: IBasicObject[];
  [key: string]: any;
}

export type RequestPayloadOptionsModified = RequestPayloadOptions &
  RequestPayloadAdditionalOptions;

interface RequestPayloadAdditionalOptions {
  rUserId: string;
}

export type IBasicValue = string | number | undefined | boolean | null;

export interface IBasicObject {
  [key: string]: IBasicValue | IBasicValue[] | IBasicObject | IBasicObject[];
}

export interface InputParams {
  name: string;
  label?: string;
  placeholder?: string;
}

export interface ActionButton {
  title: string;
  entity: EntityTypes;
  action: ActionTypes;
}

export type TableEntities = {
  [key: string]: TableAction;
};

export type TableAction = {
  action?: ActionTypes;
  entity?: ButtonEntities | CoreEntities;
  data?: ModalData;
  payloadKey?: string;
  payloadMap?: { [key: string]: string };
  filterKey?: string;
};

export interface SelectorTab {
  key: SelectorTabs;
  title: string;
}
