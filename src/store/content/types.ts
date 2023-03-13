import { JSONContent } from "@tiptap/react";
import { CancelToken } from "axios";

import { CallUser, Voting } from "components/pages/blocks/SelectorPage/types";

import { ActionTypes, EntityTypes } from "types/enums";
import { IBasicObject, RequestPayloadOptions } from "types/index";
import { ModalContexts } from "./enums";

export interface ContentState {
  data: TemplateBlockData[];
  modal: ModalData | null;
  currentAction: GenericAction | null;
  fetching: boolean;
  error: string;
}

export interface GenericAction {
  options?: RequestPayloadOptions;
  action?: ActionTypes;
  entity?: EntityTypes;
  polling?: boolean;
  cancelToken?: CancelToken;
}

export interface FormBase {
  id?: string;
  context?: ModalContexts;
  displayname?: string;
}

export interface TemplateForm extends FormBase {
  permissions?: IBasicObject[];
  participants?: IBasicObject[];
  state: string;
  calldurationsec?: string;
  default_mic?: boolean;
  default_spk?: boolean;
  default_recall?: boolean;
  current_action?: string;
  shared?: boolean;
}

export interface SelectorForm extends FormBase {
  t_id?: string;
  templates?: IBasicObject[];
  repeat?: {
    days?: number[];
    mode?: number;
  };
  repeat_count?: number;
  timestartutc?: string;
  ext?: {
    duration_plan?: number;
    duration_fact?: number;
  }
  comment?: string;
  entity?: string;
  votings?: Voting[];
  participants?: CallUser[];
  calldurationsec?: number;
  default_mic?: boolean;
  default_spk?: boolean;
  default_recall?: boolean;
  is_video?: boolean;
  video_mode?: string;
}

export type SelectorValue<T extends keyof SelectorForm> = SelectorForm[T];
export type SelectorField = keyof SelectorForm;

export type SelectorPayload = {
  [K in keyof SelectorForm]?: SelectorForm[K];
};

export interface LogTabData extends FormBase {
  log: JSONContent;
}

export interface StaticBlockFields {
  id: string;
}

export type TemplateBlock = StaticBlockFields & IBasicObject;

export type TemplateBlockData = TemplateBlock;

export type ModalData = TemplateForm | SelectorForm | LogTabData;
 