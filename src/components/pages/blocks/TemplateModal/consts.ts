import { ModalContexts } from "store/content/enums";
import { TemplateForm } from "store/content/types";
import { TabKeys } from "./enums";

export const initialTabs = [
  {
    key: TabKeys.participants,
    title: "Участники",
  },
  {
    key: TabKeys.settings,
    title: "Настройки участников",
  },
  // {
  //   key: TabKeys.permissions,
  //   title: "Права доступа",
  // },
];

export const initialUsers = [
  {
    name: "a.petrov",
    number: "234",
  },
  {
    name: "v.ivanov",
    number: "256",
  },
  {
    name: "i.sidorov",
    number: "+79985642367",
  },
];

export const exampleForm: TemplateForm = {
  permissions: initialUsers,
  participants: initialUsers,
  displayname: "Планерка",
  state: "initing",
  calldurationsec: "30",
  default_mic: true,
  default_spk: false,
  default_recall: true,
  shared: true,
}

export const initialForm: TemplateForm = {
  context: ModalContexts.create,
  permissions: [],
  participants: [],
  displayname: "",
  state: "initing",
  calldurationsec: "30",
  default_mic: true,
  default_spk: true,
  default_recall: true,
  shared: false,
}
