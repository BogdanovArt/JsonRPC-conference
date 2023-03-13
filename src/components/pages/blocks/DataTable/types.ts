import { StaticBlockFields } from "store/content/types";
import { IBasicObject } from "types/index";

export interface TableHeader {
  key: string;
  title?: string;
  sort?: boolean;
  items?: {
    [key: string]: HeaderControlItem;
  };
  buttons?: IconItem[];
}

export type HeaderControlItem = HeaderControlItemDynamic;

export type HeaderControlItemDynamic = {
  [key in IconItemKeys]: IconItem;
}

export type IconItemKeys = "on" | "off" | string;

export interface IconItem {
  action?: string;
  icon: string;
}

export type TableHeaders = TableHeader[];

export interface TableProps {
  entityId: string;
  content: IBasicObject[];
  headers: TableHeaders;
  showHeaders?: boolean;
  selectedIds?: IBasicObject,
  setSelectedIds?: (payload: IBasicObject) => void;
  returnValue?: (payload: IBasicObject) => void;
  controlsAction?: (action: string, payload?: IBasicObject) => void;
}