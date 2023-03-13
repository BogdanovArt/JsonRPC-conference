import { SIPNumber } from "@oktell/softphone";
import { PopoverOrigin } from "@material-ui/core/Popover/Popover";
import { JSONContent } from "@tiptap/react";

import { EventItem } from "../CalendarPage/Calendar";
import { IBasicObject } from "types/index";
import { SelectorTabs } from "types/enums";
import { SelectorForm } from "store/content/types";
import { IconName } from "@oktell/icons";

export interface Selector {
  id: string;
  displayname: string;
  comment: string;
  enabled: boolean;
  participants: CallUser[];
  votings: Voting[];
  notes: JSONContent;
  log: JSONContent;
  user?: string;
  default_mic?: boolean;
  default_spk?: boolean;
  default_recall?: boolean;
  calldurationsec?: number;
  is_video?: boolean;
  video_mode?: string;
}

export type SelectorEvent = SelectorExtended & EventItem;
export type SelectorExtended = Selector & SelectorForm & { user?: string };

export interface Tab {
  title: string;
  key: SelectorTabs;
  disabled?: boolean;
  icon?: IconName;
  count?: number;
  timer?: number;
}

export type CallUserExt = {
  id?: string;
  displayname?: string;
  organizer?: boolean;
};

export type Participant = {
  autokey: 1;
  department: string;
  displayname: string;
  email?: string;
  email2?: string;
  email3?: string;
  ext?: IBasicObject;
  id: string;
  jobtitle?: string;
  mobile?: string;
  mobile2?: string;
  mobile3?: string;
  number: string;
  numlocal?: string;
  numpublic?: string;
  opts?: IBasicObject;
  photo?: string;
  roomnum?: string;
  roomnum2?: string;
  roomnum3?: string;
};

export type CallUser = {
  id?: string;
  mic?: boolean;
  recall?: boolean;
  spk?: boolean;
  hold?: boolean;
  name: string;
  number: SIPNumber;
  state?: string;
  topology_type: Topology;
  ext?: CallUserExt;
  department?: string;
  is_hand_raised?: boolean;
  video_out?: boolean;
  video_cell?: number;
};

export interface Voting {
  id: string;
  name: string;
  subject: string;
  state: VotingStates;
  cases: { [caseIndex: string]: string };
  results: { [userId: string]: string };
}

export interface Note {
  id: number;
  time: number;
  duration?: number;
  text: string;
}

export type VotingStates = "opened" | "closed" | "inited";

export type ActionHandler<T = IBasicObject | IBasicObject[] | string> = (
  action: string,
  payload?: T
) => Promise<void>;

export interface PopOptions {
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export type Topology = "listener" | "assistant" | "speaker";
export type FilterKeys = "mic" | "topology_type";

export type Counter = {
  [key in Topology]: number;
};

export type UserFilters = {
  [K in keyof CallUser]?: CallUser[K];
};
export type FilterAction = <T extends keyof CallUser>(
  key?: T,
  value?: CallUser[T]
) => void;
