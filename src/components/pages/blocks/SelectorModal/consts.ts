import { InputTypes } from "components/common/Inputs/types";
import { ModalContexts } from "store/content/enums";
import { SelectorForm } from "store/content/types";
import { IBasicObject } from "types/index";
import { getDurationString, getReadableDuration } from "utils/dateConverters";
import { formatDuration } from "utils/formatDuration";
import { TimeSelBlock } from "./types";

export const initialSelectorForm = {
  templates: [
    {
      displayname: "Планерка",
      id: "5516e7f0-017a-be95-4139-005056012e0a",
    },
    {
      displayname: "Планерка 2",
      id: "5516e7f0-017a-be95-4139-005056012e0b",
    },
  ],
};

export const initialSelectorFormData = {
  displayname: "Планерка 334",
  id: "2c51f8a2-016d-5d72-d44a-50e54938780c",
  timestartutc: "2019-09-23 09:30",
  comment: "",
};

export const initialSelectorFormEmpty: SelectorForm = {
  context: ModalContexts.create,
  displayname: "",
  t_id: "",
  ext: {
    duration_plan: 0,
    duration_fact: 0,
  },
  repeat: {
    days: [],
  },
  repeat_count: 1,
  comment: "",
  calldurationsec: 45,
  default_mic: true,
  default_spk: true,
  default_recall: false,
  is_video: false,
  participants: [],
  video_mode: "1",
};

export const SelectorFormData = {
  ...initialSelectorFormEmpty,
  ...initialSelectorForm,
};

export const weekDayInputs = [
  {
    type: InputTypes.checkbox,
    options: {
      name: "1",
      label: "Пн",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "2",
      label: "Вт",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "3",
      label: "Ср",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "4",
      label: "Чт",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "5",
      label: "Пт",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "6",
      label: "Сб",
      reverse: true,
    },
  },
  {
    type: InputTypes.checkbox,
    options: {
      name: "7",
      label: "Вс",
      reverse: true,
    },
  },
];

export const defaultTimes = (startHour = 0, endHour = 24, step = 15, minutes: number = 0, duration?: boolean) => {
  const result = [];
  const start = startHour * 60 + minutes;
  for (let i = start; i < endHour * 60; i += step) {
    const time = formatDuration(i);
    let subtitle = undefined;
    
    if (duration) {
      const durationMins = i - start;
      subtitle = getDurationString(durationMins);
    }

    const chunk: IBasicObject = {
      title: time,
      value: time,
      subtitle,
    };

    if (!duration || !!subtitle) result.push(chunk);
  }
  return result;
};

