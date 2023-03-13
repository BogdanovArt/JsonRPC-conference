import { ComponentType, HTMLAttributes } from "react";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

import { EventItem } from "../../Calendar";

import {
  ActionHandler,
  CallUser,
  CallUserExt,
} from "components/pages/blocks/SelectorPage/types";
import { CalendarViews } from "types/enums";

export type EventType = ComponentType<EventProps>;

export type EventProps = Appointments.AppointmentProps & {
  type?: CalendarViews;
  search?: string;
  eventClick: (item: EventItem | null) => void;
  actionHandler?: ActionHandler;
};

export type EventContentProps = {
  title?: string;
  comment?: string;
  owner?: string;
  timeStart?: string;
  timeEnd?: string;
  participants?: Array<CallUser & CallUserExt>;
  controls?: JSX.Element | JSX.Element[];
  clickHandler?: () => void;
} & HTMLAttributes<HTMLDivElement>;
