import { MenuItemTypes } from "store/menu/enums";

export enum RequestMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  DELETE = "DELETE",
  PUT = "PUT",
}

export enum PayloadKeys {
  TEMPLATE = "template",
  TEMPLATES = "templates",
  SELECTOR = "selector",
  SELECTORS = "selector",
  CODE = "code",
  PARAM = "param",
  SELECTOR_ID = "selector_id",
  VOTING_ID = "voting_id",
  VOTING = "voting",
  PARTICIPANT = "participant_id",
  TOPOLOGY = "topology_type",
  BUTTON = "button",
  CALL_USER = "participant",
  R_USER_ID = "rUserId",
  VIDEO_MODE = "video_mode",
  VIDEO_CELL = "video_cell",
}

export enum ActionTypes {
  text = "text",
  add = "add",
  left_menu = "left_menu",
  get = "get",
  press = "press",
  delete = "delete",
  create = "create",
  update = "update",
  search = "search",
  share = "update_share",
  run = "run",
  finish = "finish",
  start = "start",
  stop = "stop",
  none = "none",
  patch = "patch",
}

export enum CoreEntities {
  content = "menu_data",
  system_view = "system_view",
  popup = "popup",
  selectors_grid = "selectors_grid",
  selector_grid = "sel_grid",
  archived_grid = "arch_sel_grid",
}

export enum ButtonEntities {
  DOWNLOAD = "download",
  TEMPLATE_UPDATE = "template_update_ok_button",
  TEMPLATE_CLOSE = "template_close_button",
  TEMPLATE_DELETE = "t_del_button",
  TEMPLATE_ADD_PARTICIPANT = "TN_add_participant",
  TEMPLATE_REMOVE_PARTICIPANT = "TN_del_participant",
  TEMPLATE_ADD_USER_ACCESS = "TN_add_user_access",
  TEMPLATE_REMOVE_USER_ACCESS = "TN_remove_user_access",
  TEMPLATE_CREATE = "tn_button",
  TEMPLATE_EDIT = "t_grid",
  SELECTOR_PARTICIPANT_TOPOLOGY = "participant_topology_button",
  SELECTOR_UPDATE_PARTICIPANT = "paticipant_change_buttons",
  SELECTOR_ADD_PARTICIPANT = "selector_add_participant",
  SELECTOR_REMOVE_PARTICIPANT = "participant_delete_buttons",
  SELECTOR_CREATE = "Select_new_button",
  SELECTOR_SAVE = "Select_save_button",
  SELECTOR_UPDATE = "selector_update_button",
  SELECTOR_DELETE = "select_delete_button",
  SELECTOR_EDIT = "selector_settings_button",
  SELECTOR_RUN = "selector_run_button",
  SELECTOR_FINISH = "selector_finish_button",
  SELECTOR_START = "selector_start",
  SELECTOR_STOP = "selector_stop",
  SELECTOR_MUTE_ALL = "mute_all",
  SELECTOR_UNMUTE_ALL = "unmute_all",
  SELECTOR_STATE_VOTING = "voting_status_button",
  SELECTOR_ADD_VOTING = "voting_add_button",
  SELECTOR_DEL_VOTING = "voting_delete_button",
  SELECTOR_CHANGE_LAYOUT = "change_layout_btn",
  SELECTOR_CHANGE_VIDEO_CELL = "change_video_cell",
  ARCHIVED_SETTINGS = "arch_sel_settings",
  ARCHIVED_SEARCH = "arch_search_button",
  ARCHIVED_REPORT = "arch_sel_report",
}

export type EntityTypes = CoreEntities | ButtonEntities;

export enum TabCodes {
  tab1 = "oktell_tab1",
  tab2 = "oktell_tab2",
  tab3 = "oktell_tab3",
}

export enum ColorThemes {
  light = "light",
  dark = "dark",
}

export enum LSkeys {
  colorTheme = "color_theme",
}

export enum SelectorTabs {
  participants = "participants",
  selector = "selector",
  notes = "notes",
  voting = "voting",
  chat = "chat",
  handsup = "händehoch",
}

export enum VotingStatuses {
  INIT = "inited",
  STARTED = "opened",
  ENDED = "closed",
}

export enum SortOrders {
  ASC = "ascending",
  DSC = "descending",
}

export type RequestCodes = MenuItemTypes;

export type CalendarViews = "Month" | "Week" | "Day";

export type BreakPoints = "xs" | "md" | "lg" | "xl";

export const BreakPointValues: { [key in BreakPoints]: number } = {
  xs: 480,
  md: 600,
  lg: 960,
  xl: 1280,
};

