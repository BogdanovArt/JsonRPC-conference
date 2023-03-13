import { TableHeader } from "components/pages/blocks/DataTable/types";
import { initialForm } from "components/pages/blocks/TemplateModal/consts";
import { ModalContexts } from "store/content/enums";
import { MenuItemTypes } from "store/menu/enums";
import { MenuItemSchema } from "store/menu/types";
import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  PayloadKeys,
} from "types/enums";
import { IBasicObject } from "types/index";
import { ActionMap, ModalTitles } from "./types";

export const defaultError =
  "При запросе на сервер произошла ошибка, или сервер вернул некорректные данные";
export const recordUser = "9998";

export const MineActions = {
  create: {
    data: initialForm,
  },
  delete: {
    entity: ButtonEntities.TEMPLATE_DELETE,
    action: ActionTypes.delete,
    payloadKey: PayloadKeys.TEMPLATES,
  },
  dbclick: {
    entity: ButtonEntities.TEMPLATE_EDIT,
    payloadKey: PayloadKeys.TEMPLATE,
  },
  share: {
    entity: ButtonEntities.TEMPLATE_EDIT,
    action: ActionTypes.share,
    payloadKey: PayloadKeys.TEMPLATE,
  },
};

export const CommonActions = {
  dbclick: {
    entity: ButtonEntities.TEMPLATE_EDIT,
    payloadKey: PayloadKeys.TEMPLATE,
  },
};

export const CurrentActions: ActionMap = {
  create: {
    action: ActionTypes.get,
    entity: ButtonEntities.SELECTOR_CREATE,
    payloadKey: PayloadKeys.CODE,
    // data: SelectorFormData,
  },
  settings: {
    entity: ButtonEntities.SELECTOR_EDIT,
    payloadKey: PayloadKeys.SELECTOR,
  },
  // add "open selector" action here, as doubleclick evokes "edit" event
  dbclick: {
    entity: CoreEntities.selector_grid,
    payloadKey: PayloadKeys.SELECTOR,
  },
  delete: {
    entity: ButtonEntities.SELECTOR_DELETE,
    action: ActionTypes.delete,
    payloadKey: PayloadKeys.SELECTORS,
  },
  run: {
    entity: ButtonEntities.SELECTOR_RUN,
    action: ActionTypes.run,
    payloadKey: PayloadKeys.SELECTOR,
  },
  finish: {
    entity: ButtonEntities.SELECTOR_FINISH,
    action: ActionTypes.finish,
    payloadKey: PayloadKeys.SELECTOR,
  },
};

export const SelectorActions: ActionMap = {
  new_selector: {
    action: ActionTypes.get,
    entity: ButtonEntities.SELECTOR_CREATE,
    payloadKey: PayloadKeys.CODE,
  },
  back: {
    entity: CoreEntities.content,
    options: { code: MenuItemTypes.calendar },
  },
  start: {
    entity: ButtonEntities.SELECTOR_START,
    action: ActionTypes.start,
    payloadKey: PayloadKeys.SELECTOR_ID,
  },
  stop: {
    entity: ButtonEntities.SELECTOR_STOP,
    action: ActionTypes.stop,
    payloadKey: PayloadKeys.SELECTOR_ID,
  },
  update: {
    entity: ButtonEntities.SELECTOR_UPDATE,
    action: ActionTypes.update,
    payloadMap: {
      selector: "selector",
      code: "code",
    },
  },
  controls: {
    entity: ButtonEntities.SELECTOR_UPDATE_PARTICIPANT,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      participant_id: "id",
      button: "button",
    },
  },
  add: {
    entity: ButtonEntities.SELECTOR_ADD_PARTICIPANT,
    action: ActionTypes.add,
    payloadMap: {
      selector_id: "entityId",
      participant: "participant",
    },
  },
  remove: {
    entity: ButtonEntities.SELECTOR_REMOVE_PARTICIPANT,
    action: ActionTypes.delete,
    payloadMap: {
      selector_id: "entityId",
      participant_id: "id",
    },
  },
  topology_type: {
    entity: ButtonEntities.SELECTOR_PARTICIPANT_TOPOLOGY,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      participant_id: "id",
      topology_type: "type",
    },
  },
  add_voting: {
    entity: ButtonEntities.SELECTOR_ADD_VOTING,
    action: ActionTypes.create,
    payloadMap: {
      selector_id: "entityId",
      voting: "voting",
    },
  },
  delete_voting: {
    entity: ButtonEntities.SELECTOR_DEL_VOTING,
    action: ActionTypes.delete,
    payloadMap: {
      selector_id: "entityId",
      voting_id: "votingId",
    },
  },
  voting_state_update: {
    entity: ButtonEntities.SELECTOR_STATE_VOTING,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      voting_id: "votingId",
    },
  },
  participant_mic_update: {
    entity: ButtonEntities.SELECTOR_UPDATE_PARTICIPANT,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      participant_id: "participant_id",
      rUserId: "rUserId",
      button: "button",
    },
  },
  participant_all_mic_mute: {
    entity: ButtonEntities.SELECTOR_MUTE_ALL,
    action: ActionTypes.patch,
    payloadMap: {
      selector: "selectorId",
      rUserId: "rUserId",
    },
  },
  participant_all_mic_unmute: {
    entity: ButtonEntities.SELECTOR_UNMUTE_ALL,
    action: ActionTypes.patch,
    payloadMap: {
      selector: "selectorId",
      rUserId: "rUserId",
    },
  },
  selector_change_layout: {
    entity: ButtonEntities.SELECTOR_CHANGE_LAYOUT,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      rUserId: "rUserId",
      video_mode: "videoMode",
    },
  },

  selector_change_video_cell: {
    entity: ButtonEntities.SELECTOR_CHANGE_VIDEO_CELL,
    action: ActionTypes.update,
    payloadMap: {
      selector_id: "entityId",
      rUserId: "rUserId",
      video_cell: "videoCell",
      participant_id: "id",
    },
  },
  delete: CurrentActions.delete,
  selector_call_settings: CurrentActions.settings,
};

export const ArchivedSelectorActions: ActionMap = {
  back: {
    entity: CoreEntities.content,
    options: { code: MenuItemTypes.arch },
  },
};

export const ArchivedActions: ActionMap = {
  settings: {
    entity: ButtonEntities.ARCHIVED_SETTINGS,
    payloadKey: PayloadKeys.SELECTOR,
  },
  dbclick: {
    entity: CoreEntities.archived_grid,
    payloadKey: PayloadKeys.SELECTOR,
  },
  search: {
    entity: ButtonEntities.ARCHIVED_SEARCH,
    action: ActionTypes.search,
    payloadKey: PayloadKeys.PARAM,
  },
  agenda: {
    entity: ButtonEntities.ARCHIVED_REPORT,
    payloadKey: PayloadKeys.SELECTOR,
  },
};

export const CurrentCoreActions: ActionMap = {
  polling: {
    entity: CoreEntities.selectors_grid,
    action: ActionTypes.update,
    options: { code: MenuItemTypes.none },
  },
};

export const CalendarPageActions: ActionMap = {
  polling: {
    entity: CoreEntities.content,
    action: ActionTypes.get,
    options: {
      code: MenuItemTypes.calendar,
    },
  },
};

export const SelectorCoreActions: ActionMap = {
  polling: {
    entity: CoreEntities.selector_grid,
    action: ActionTypes.get,
    options: {},
  },
};

export const tempCurrentSelectorData = {
  fq: 2.512388123,
  selectors: [
    {
      id: "2c51f8a2-016d-5d72-d44a-50e54938780c",
      state: "online",
      displayname: "SelectorAAA",
      enabled: true,
      timestartutc: "2019-09-23 14:30",
      participants: 15,
    },
    {
      id: "d713088d-016d-5d72-ae04-50e54938780c",
      state: "waiting",
      displayname: "SelectorBBB",
      enabled: false,
      timestartutc: "2019-09-23 09:30",
      participants: 10,
    },
  ],
};

export const tempSelectorData = {
  // fq: 10,
  selector: {
    id: "2c51f8a2-016d-5d72-d44a-50e54938780c",
    displayname: "Селектор 33",
    enabled: true,
    comment: "brown fox jumps over the lazy dog",
    participants: [
      {
        id: "83d41cb6-016d-5d75-6341-50e54938780c",
        state: "online", // offline | hold
        status: "waiting", // ??? | ???
        number: "123",
        name: "Василий Юрьевич Свидригайлов (Главный менеджер по работе с поставками)",
        topology_type: "listener",
        spk: true,
        mic: false,
        recall: true,
      },
      {
        id: "83d41cb6-016d-5d75-6341-50e54938780d",
        state: "offline",
        status: "waiting",
        number: "221",
        name: "Косарева Екатерина Владимировна",
        topology_type: "assistant",
        spk: true,
        mic: true,
        recall: true,
      },
      {
        id: "83d41cb6-016d-5d75-6341-50e54938780e",
        state: "",
        status: "waiting",
        number: "+7 (959) 318 88 56",
        name: "Владислав",
        topology_type: "listener",
        spk: false,
        mic: true,
        recall: false,
      },
    ],
    votings: [
      {
        id: "7f50172f-016d-6263-9795-50e54938780c",
        name: "Голосование 1",
        subject:
          "Вопрос о назначении даты для проведения стратегической сессии: 12.10.2019",
        state: "closed",
        cases: {
          "0": "Против",
          "1": "За",
          "2": "Воздерживаюсь",
        },
        results: {
          "06410860-0180-e704-bca9-fa163e25a239": "1",
          "2123ee1b-017c-c6e7-6afb-fa163e25a239": "1",
          "6f7e4558-017c-c6e7-25e1-fa163e25a239": "1",
          "d88c3633-0180-e022-7526-fa163e25a239": "2",
        },
      },
      {
        id: "7f50172f-016d-6263-9795-50e54938780z",
        name: "Выборы императора земли",
        subject:
          "Вопрос о назначении даты для проведения стратегической сессии: 12.10.2019",
        state: "opened",
        cases: {
          "0": "Иванов",
          "1": "Петров",
          "2": "Гольдберг",
        },
        results: {
          "83d41cb6-016d-5d75-6341-50e54938780c": "1",
          "83d41cb6-016d-5d75-6341-50e54938780d": "1",
          "83d41cb6-016d-5d75-6341-50e54938780e": "0",
          "83d41cb6-016d-5d75-6341-50e54938780f": "2",
          "83d41cb6-016d-5d75-6341-50e54938780g": "2",
          "83d41cb6-016d-5d75-6341-50e54938780h": "0",
          "83d41cb6-016d-5d75-6341-50e54938780i": "0",
          "83d41cb6-016d-5d75-6341-50e54938780j": "1",
          "83d41cb6-016d-5d75-6341-50e54938780k": "1",
          "83d41cb6-016d-5d75-6341-50e54938780l": "0",
          "83d41cb6-016d-5d75-6341-50e54938780m": "1",
        },
      },
    ],
    notes: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
          },
          content: [
            {
              type: "text",
              text: "Первый вопрос повестки",
            },
          ],
        },
        {
          type: "recordBlock",
          attrs: {
            id: "2c51f8a2-016d-5d72-d44a-50e54938780c",
            timeStart: "2021-09-28 10:33",
            timeEnd: "2021-09-28 12:45",
          },
        },
      ],
    },
    log: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
          },
          content: [
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "2021-09-28 10:33",
            },
            {
              type: "text",
              text: " Запуск селектора",
            },
          ],
        },
      ],
    },
  },
};

export const tempArchivedSelectorData = {
  selectors: [
    {
      id: "2c51f8a2-016d-5d72-d44a-50e54938780c",
      displayname: "SelectorAAA",
      timestartutc: "2019-09-23 14:30",
      participants: 15,
    },
    {
      id: "d713088d-016d-5d72-ae04-50e54938780c",
      displayname: "SelectorBBB",
      timestartutc: "2019-09-23 09:30",
      participants: 10,
    },
  ],
};

export const archivedHeaders: TableHeader[] = [
  {
    key: "displayname",
    title: "Наименование",
    sort: true,
  },
  {
    title: "Дата и время",
    key: "timestartutc",
    sort: true,
  },
  {
    key: "participants",
    title: "Количество участников",
    sort: true,
  },
  {
    key: "state-buttons",
    buttons: [
      {
        icon: "svg/settings.svg",
        action: "settings",
      },
      {
        icon: "svg/bookmark.svg",
        action: "agenda",
      },
    ],
  },
];

export const selectorHeaders = [
  {
    key: "state-buttons",
    items: {
      state: {
        online: {
          icon: "svg/useronline.svg",
        },
        off: {
          icon: "svg/userhold.svg",
        },
        waiting: {
          icon: "svg/userwait.svg",
        },
        calling: {
          icon: "svg/calling.svg",
        },
        retry: {
          icon: "svg/calling.svg",
        },
        default: {
          icon: "svg/useroffline.svg",
        },
      },
      // status: {
      //   waiting: {
      //     icon: "svg/userwait.svg",
      //   },
      //   want_say: {
      //     icon: "svg/micmessage.svg",
      //   },
      //   default: {
      //     icon: "svg/initing.svg",
      //   },
      // },
    },
  },
  {
    key: "controls-boolean",
    items: {
      hold: {
        on: {
          icon: "svg/callhold.svg",
        },
        off: {
          icon: "svg/hollow.svg",
        },
      },
    },
  },
  {
    key: "number",
    title: "Номер",
    sort: true,
  },
  {
    key: "name",
    title: "Имя",
    sort: true,
  },
  {
    key: "topology_type",
    title: "Роль",
    sort: true,
  },
  {
    key: "controls-boolean",
    items: {
      spk: {
        on: {
          icon: "svg/volume.svg",
          action: "controls",
        },
        off: {
          icon: "svg/volumeoff.svg",
          action: "controls",
        },
      },
      mic: {
        on: {
          icon: "svg/mic.svg",
          action: "controls",
        },
        off: {
          icon: "svg/micoff.svg",
          action: "controls",
        },
      },
      recall: {
        on: {
          icon: "svg/refresh.svg",
          action: "controls",
        },
        off: {
          icon: "svg/refreshoff.svg",
          action: "controls",
        },
      },
      remove: {
        off: {
          icon: "svg/remove.svg",
          action: "remove",
        },
        on: {
          icon: "svg/remove.svg",
          action: "remove",
        },
      },
    },
  },
];

export const currentHeaders = [
  {
    key: "state-buttons",
    items: {
      state: {
        online: {
          icon: "svg/online.svg",
        },
        waiting: {
          icon: "svg/waiting.svg",
        },
        error: {
          icon: "svg/error.svg",
        },
        connecting: {
          icon: "svg/connect.svg",
        },
        default: {
          icon: "svg/connect.svg",
        },
      },
    },
  },
  {
    key: "displayname",
    title: "Наименование шаблона",
    sort: true,
  },
  {
    key: "timestartutc",
    title: "Дата",
    sort: true,
  },
  {
    key: "participants",
    title: "Количество участников",
    sort: true,
  },
  {
    key: "state-buttons",
    items: {
      state: {
        online: {
          icon: "svg/stop.svg",
          action: "finish",
        },
        waiting: {
          icon: "svg/play.svg",
          action: "run",
        },
        default: {
          icon: "svg/wand.svg",
        },
      },
    },
    buttons: [
      {
        icon: "svg/settings.svg",
        action: "settings",
      },
    ],
  },
];

export const modalTitles: ModalTitles = {
  [MenuItemTypes.common]: {
    [ModalContexts.readonly]: "Просмотр настроек шаблона совещания",
  },
  [MenuItemTypes.mine]: {
    [ModalContexts.create]: "Новый шаблон совещания",
    [ModalContexts.edit]: "Редактирование шаблона совещания",
  },
  [MenuItemTypes.current]: {
    [ModalContexts.create]: "Создание совещания",
    [ModalContexts.edit]: "Редактирование совещания",
    [ModalContexts.readonly]: "Просмотр настроек совещания",
  },
  [MenuItemTypes.arch]: {
    [ModalContexts.edit]: "Просмотр настроек совещания",
    [ModalContexts.logs]: "Просмотр лога совещания",
  },
};

export const tempMenuData: MenuItemSchema[] = [
  {
    name: "Шаблоны",
    code: MenuItemTypes.templates,
    description: "Шаблоны селекторных совещаний",
    icon: "template.png",
    order: 10,
    parent: null,
    clickable: false,
  },
  {
    name: "Мои",
    code: MenuItemTypes.mine,
    description: "Шаблоны пользователя",
    icon: null,
    order: 10,
    parent: MenuItemTypes.templates,
    clickable: true,
  },
  {
    name: "Общие",
    code: MenuItemTypes.common,
    description: "Общие шаблоны совещаний",
    icon: null,
    order: 20,
    parent: MenuItemTypes.templates,
    clickable: true,
  },
  {
    name: "Текущие",
    code: MenuItemTypes.current,
    description: "Текущие селекторные совещания",
    icon: "clock.png",
    order: 20,
    parent: null,
    clickable: false,
  },
  {
    name: "Three",
    code: MenuItemTypes.testone,
    description: "Шаблоны пользователя",
    icon: null,
    order: 20,
    parent: MenuItemTypes.current,
    clickable: true,
  },
  {
    name: "Four",
    code: MenuItemTypes.testtwo,
    description: "Общие шаблоны совещаний",
    icon: null,
    order: 30,
    parent: MenuItemTypes.current,
    clickable: true,
  },
  {
    name: "Архивные",
    code: MenuItemTypes.arch,
    description: "Архивные селекторные совещания",
    icon: "download.png",
    order: 30,
    parent: null,
    clickable: true,
  },
];

export const defaultTemplates = [
  {
    displayname: "Планерка",
    id: "5516e7f0-017a-be95-4139-005056012e0b",
    participants: 10,
    shared: true,
  },
  {
    displayname: "Совещание начальников отделов",
    id: "b8dc5283-0178-b02d-a1f7-005056012e0b",
    participants: 15,
    shared: true,
  },
  {
    displayname: "Обучение (курсы)",
    id: "e651e486-017a-beb6-567c-005056012e0b",
    participants: 5,
    shared: false,
  },
];

export const defaultParticipant: IBasicObject = {
  state: "waiting",
  hold: false,
  mic: true,
  spk: true,
  recall: false,
  topology_type: "listener",
};

export const defaultTemplateEdit = {
  id: "5516e7f0-017a-be95-4139-005056012e0b",
  displayname: "Планерка",
  participants: [
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
  ],
  state: "initing",
  calldurationsec: "30",
  default_mic: true,
  default_spk: true,
  default_recall: true,
  shared: true,
};

export const defaultCommonTemplates = [
  {
    displayname: "Планерка",
    id: "5516e7f0-017a-be95-4139-005056012e0b",
    participants: 10,
    user: "a.petrov",
  },
  {
    displayname: "Совещание начальников отделов",
    id: "b8dc5283-0178-b02d-a1f7-005056012e0b",
    participants: 15,
    user: "a.petrov",
  },
  {
    displayname: "Вебинар по новому продукту",
    id: "e651e486-017a-beb6-567c-005056012e0b",
    participants: 5,
    user: "a.petrov",
  },
];

export const mineHeaders = [
  {
    key: "displayname",
    title: "Наименование шаблона",
    sort: true,
  },
  {
    key: "participants",
    title: "Количество участников",
    sort: true,
  },
  {
    key: "controls-boolean",
    items: {
      shared: {
        on: {
          action: "share",
          icon: "svg/share.svg",
        },
        off: {
          action: "share",
          icon: "svg/key.svg",
        },
      },
    },
  },
];

export const commonHeaders = [
  {
    key: "displayname",
    title: "Наименование шаблона",
    sort: true,
  },
  {
    key: "participants",
    title: "Количество участников",
    sort: true,
  },
  {
    key: "user",
    title: "Владелец",
    sort: true,
  },
];

export const defaultUsers = [
  {
    id: "61c0b3aa-016d-61e6-0f67-50e54938780c",
    name: "Vasya",
    number: "123",
    state: "waiting",
    hold: false,
    mic: true,
    spk: true,
    recall: false,
    topology_type: "listener",
  },
  {
    id: "eb3864c3-016d-5d75-9544-50e54938780c",
    name: "16",
    number: "16",
    state: "waiting",
    hold: false,
    mic: true,
    spk: true,
    recall: false,
    topology_type: "listener",
  },
];

export const pollingMessage = "polling-запрос прерван пользователем";

export const LSKeys = {
  selector_start: (id: string) => `selector_${id}_start`,
  selector_notes: (id: string) => `selector_${id}_notes`,
};
