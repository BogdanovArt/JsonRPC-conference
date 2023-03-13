import { IBasicObject } from "types/index";
import { SelectorTabs } from "types/enums";
import {
  getRandomBoolean,
  getRandomElement,
  getRandomString,
} from "utils/randomizer";
import { CallUser, CallUserExt, PopOptions, Tab, Topology } from "./types";

export const selectorModes = [
  {
    title: "Показать всех",
    value: "",
  },
  {
    title: "Только online",
    value: "online",
  },
];

export const selectorUserRoles = [
  {
    value: "listener",
    title: "Слушатель",
  },
  {
    value: "assistant",
    title: "Ассистент",
  },
  {
    value: "speaker",
    title: "Ведущий",
  },
];

export const Tabs: Tab[] = [
  {
    key: SelectorTabs.participants,
    title: "Участники",
    icon: "party",
  },
  {
    key: SelectorTabs.notes,
    title: "Заметки",
    icon: "stickynote",
    // disabled: true,
  },
  {
    key: SelectorTabs.voting,
    title: "Опросы",
    icon: "poll",
  },
  // {
  //   key: SelectorTabs.chat,
  //   title: "Чат",
  //   icon: "message",
  //   disabled: true,
  // },
  {
    key: SelectorTabs.handsup,
    title: "Подняли руки",
    icon: "hand",
    // disabled: true,
  },
];

export const CurrentSelectorTabs: Tab[] = [
  {
    key: SelectorTabs.selector,
    title: "Селектор",
    icon: "calling",
    // disabled: true,
  },
  ...Tabs,
];

export const TempUser = (): CallUser & CallUserExt => ({
  id: "83d41cb6-016d-5d75-6341-50e54938780c",
  mic: getRandomBoolean(),
  name: `${getRandomString(6)} ${getRandomString(8)}`,
  number: "248",
  recall: getRandomBoolean(),
  spk: getRandomBoolean(),
  state: "online",
  topology_type: getRandomElement<Topology>([
    "listener",
    "assistant",
    "speaker",
  ]),
});

export const roles: { [key in Topology]?: IBasicObject } = {
  listener: { title: "Участник" },
  assistant: { title: "Ассистент" },
  speaker: { title: "Ведущий" },
};

export const CornerPosition: PopOptions = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right",
  },
};
