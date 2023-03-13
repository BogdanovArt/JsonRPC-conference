import { GenericAction, TemplateForm } from "store/content/types";

import { TabKeys } from "./enums";

export interface TabProps {
  returnValue?: () => void;
  initial?: TemplateForm;
  readonly?: boolean;
}

export interface Tab {
  key: TabKeys;
  title: string;
}

