import { EntityTypes } from "types/enums";
import { MenuItemTypes } from "./enums";

export interface MenuState {
  data: MenuStateData;
  active: MenuItemSchema | null;
  show: boolean;
}

export interface MenuItemSchema {
  name: string;
  code: MenuItemTypes;
  description: string;
  icon: string | null;
  order: number;
  parent: MenuItemTypes | null;
  children?: MenuItemSchema[];
  clickable: boolean;
  entity?: EntityTypes;
}

export type MenuStateData = MenuItemSchema[];
