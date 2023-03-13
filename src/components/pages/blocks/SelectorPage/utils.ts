import { GenericAction } from "store/content/types";
import { ActionTypes } from "types/enums";
import { IBasicObject, TableAction } from "types/index";
import { CallUser, Participant } from "./types";

interface ActionCreatorOptions {
  action: TableAction;
  payload: IBasicObject | IBasicObject[] | string;
}

export const actionCreator = ({ action, payload }: ActionCreatorOptions) => {
  let pl: GenericAction = {
    action: action?.action || ActionTypes.get,
    entity: action?.entity,
  };

  if (action?.payloadKey && payload) {
    pl.options = { [action.payloadKey]: payload };
  } else if (action?.payloadMap && payload) {
    pl.options = {};
    const map = action?.payloadMap;
    Object.keys(map).forEach((key: string) => {
      pl.options[key] = (payload as IBasicObject)[map[key]];
    });
  }

  return pl;
};

export const userConverter = (user: Participant): CallUser => {
  return {
    name: user.displayname,
    number: user.number,
    state: "waiting",
    topology_type: "listener",
    department: user.department,
    mic: true,
    video_out: false,
    ext: {
      id: user.id,
    },
  };
};
