import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Slide from "@material-ui/core/Slide";
import { format } from "date-fns";
import { CalendarPicker, TouchEvents } from "@oktell/inputs";
import { Portal } from "@oktell/header-panel";
import { isMobile, isTablet } from "react-device-detect";
import { GenericAction } from "@oktell/utils/lib/apiRequest";

import { Search } from "components/common/Inputs/Search";

import { CalendarModal } from "./CalendarModal";
import { ViewToggler } from "./blocks/ViewToggler";
import { AddButton } from "../SelectorPage/Tabs/Participants/AddButton";
import { CreateSelectorModal } from "./blocks/CreateSelectorModal";
import { CalendarScheduler } from "./blocks/Scheduler";
import { Toolbar } from "./blocks/MobileToolbar";
import { DateNavButton } from "./Parts";

import {
  Months,
  DMonths,
  ViewTypes,
  ModalStyles,
  SlideTabletStyles,
  SlideMobileStyles,
  SlideStyles,
} from "./consts";
import { initialSelectorFormEmpty } from "../SelectorModal/consts";
import { actionCreator } from "../SelectorPage/utils";
import { convertItem, convertItems } from "utils/convertCalendarItems";
import { LSKeys } from "utils/consts";
import { apiRequest, requestUrl } from "utils/apiRequest";
import { copy } from "utils/copy";
import { getUserId } from "utils/getUserId";

import { requestContentData, requestLocalData } from "store/content/actions";
import { setCurrentAction } from "store/content";

import {
  ActionHandler,
  CallUser,
  Selector,
  SelectorEvent,
} from "../SelectorPage/types";
import {
  ActionTypes,
  CalendarViews,
  CoreEntities,
  RequestMethods,
} from "types/enums";
import { IBasicObject } from "types/index";
import { AppDispatch } from "store/index";
import { ActionMap } from "utils/types";
import { SelectorForm } from "store/content/types";
import { FormKeys } from "../TemplateModal/enums";
import { ModalContexts } from "store/content/enums";
import { getBreakPoint } from "store/core/getters";
import { ScrolledEvents, ScrollStates } from "./blocks/types";
import { Filters } from "../ResultsPage/types";

import styles from "./Calendar.module.scss";
import commonStyles from "components/layout/Default.module.scss";
import modalStyles from "./blocks/CalendarModal/Slide.module.scss";

let scrolledBuffer: ScrolledEvents = {};

export const ScrollContext = createContext<ScrolledEvents>(scrolledBuffer);

interface ResponsePayload {
  selector: Selector;
}

interface UpdateResponse {
  fq: number;
  selectors: Selector[];
}

export interface EventItem {
  id: string;
  owner: string;
  startDate: Date;
  endDate: Date;
  title: string;
  participants?: CallUser[];
  enabled: boolean;
  comment?: string;
}

interface Props {
  items?: Array<SelectorForm & Selector>;
  actions?: ActionMap;
  // modal?: ModalData;
}

export function CalendarPage({ items = [], actions }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [view, setView] = useState<CalendarViews>("Week");
  const [current, setCurrent] = useState<string>(`${new Date()}`);

  const [showSearch, setShowSearch] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState<SelectorEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const [scrolled, setScrolled] = useState<ScrolledEvents>(scrolledBuffer);

  const [newSelector, setNewSelector] = useState<SelectorForm>(null);
  const [newSelectorModal, setNewSelectorModal] = useState(false);

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["xl", "lg"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const handleEventScroll = (state: ScrollStates, event: EventItem) => {
    const hidden = copy(scrolledBuffer);

    const index = event.startDate ? format(event.startDate, "yyyy-MM-dd") : "";
    const day = hidden[index] || [];

    switch (state) {
      case "above":
        day.unshift(event);
        break;
      default:
        const match = day.findIndex((el) => el.id === event.id);
        if (match > -1) {
          day.splice(match, 1);
        }
        break;
    }

    hidden[index] = day;

    scrolledBuffer = hidden;
    setScrolled(hidden);
  };

  const actionHandler = async (
    action: string,
    payload?: IBasicObject | IBasicObject[] | string
  ) => {
    const content = focusedEvent;
    const ACTION = actions?.[action];

    // console.log(ACTION);

    let res: {
      success: boolean;
      data?: unknown;
      error?: string;
    } = {
      success: false,
      data: null,
      error: "",
    };

    if (!ACTION) {
      customActionHandler(action, payload);
      return;
    }

    if (ACTION.payloadMap && typeof payload === "object") {
      (payload as IBasicObject).entityId = content?.id;
    }

    if (ACTION) {
      const actionPayload = actionCreator({ action: ACTION, payload });

      // console.log("-------------------", actionPayload);

      // return;

      switch (action) {
        case "start":
          res = await dispatch(requestContentData(actionPayload));
          if (res?.success) {
            const start = localStorage.getItem(
              LSKeys.selector_start(payload as string)
            );
            if (!start) {
              localStorage.setItem(
                LSKeys.selector_start(payload as string),
                `${Date.now()}`
              );
            }
            dispatch(setCurrentAction({ entity: CoreEntities.selector_grid }));
          }
          break;
        case "topology_type":
        case "remove":
        case "add":
        case "add_voting":
        case "delete_voting":
        case "voting_state_update":
        case "participant_mic_update":
          res = await dispatch(requestLocalData(actionPayload));
          const selA = (res?.data as ResponsePayload)?.selector;
          if (selA) setFocusedEvent({ ...focusedEvent, ...selA });
          break;
        case "selector_call_settings":
          res = await dispatch(requestLocalData(actionPayload));
          const selector = res?.data as Selector;
          if (selector) setFocusedEvent({ ...focusedEvent, ...selector });
          break;
        case "update":
          res = await dispatch(requestLocalData(actionPayload));
          const selectors = (res?.data as UpdateResponse)?.selectors;
          const selectorMatch = selectors?.find(
            (sel) => sel.id === content?.id
          );
          if (selectorMatch)
            setFocusedEvent({ ...focusedEvent, ...selectorMatch });
          break;
        default:
          await dispatch(requestContentData(actionPayload));
          break;
      }
    }
  };

  const customActionHandler: ActionHandler = async (action, payload) => {
    // console.warn(action);
    switch (action) {
      case "selector_edit":
      case "selector_copy":
        const source = payload as IBasicObject;
        const localDate = new Date(source.startDate as string);
        const start = format(localDate, "yyyy-MM-dd HH:mm");

        const selectorInitialData = {
          ...initialSelectorFormEmpty,
          ...(source as SelectorForm),
          [FormKeys.repeat]: { days: [], mode: 1 },
          [FormKeys.timeStartUTC]: start,
          context: ModalContexts.edit,
        } as SelectorForm & EventItem;

        delete selectorInitialData.startDate;
        delete selectorInitialData.endDate;
        delete selectorInitialData.enabled;
        delete selectorInitialData.title;

        if (action === "selector_copy") {
          delete selectorInitialData.id;
          selectorInitialData.context = ModalContexts.create;
          setShowModal(false);
          setTimeout(() => setFocusedEvent(null), 250);
        }

        openNewSelectorModal(selectorInitialData);
        break;
      default:
        break;
    }
  };

  const handleModal = async (item: EventItem | null) => {
    // console.warn(item);

    if (!item) return;

    const ACTION: GenericAction = {
      action: ActionTypes.get,
      entity: CoreEntities.selector_grid,
      options: {
        selector: { id: item.id },
      },
    };
    const res = await apiRequest({
      data: ACTION,
      method: RequestMethods.POST,
      url: requestUrl,
    });
    const selector = res?.data?.data?.selector as Selector;
    if (selector) {
      setFocusedEvent({ ...item, ...selector });
    }
  };

  const getNewSelector = () => {
    const initialFormData: SelectorForm = {
      ...initialSelectorFormEmpty,
    };

    return initialFormData;
  };

  const refreshEventModal = (item: SelectorForm & Selector) => {
    if (showModal) {
      const converted = convertItem(item) as SelectorEvent;
      setFocusedEvent({ ...converted, ...item });
    }
  };

  const createSelectorWithDate = (date?: Date) => {
    const initial = getNewSelector();
    const currentDate = new Date();

    currentDate.setMilliseconds(
      Math.ceil(currentDate.getMilliseconds() / 1000) * 1000
    );
    currentDate.setSeconds(Math.ceil(currentDate.getSeconds() / 60) * 60);
    currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 15) * 15);

    initial[FormKeys.timeStartUTC] = date
      ? format(date, "yyyy-MM-dd HH:mm")
      : format(currentDate, "yyyy-MM-dd HH:mm");

    openNewSelectorModal(initial);
  };

  const openNewSelectorModal = (initial: SelectorForm = getNewSelector()) => {
    setNewSelector(initial);
    setTimeout(() => {
      setNewSelectorModal(true);
    }, 0);
  };

  const closeNewSelectorModal = () => {
    setNewSelectorModal(false);
    setTimeout(() => {
      setNewSelector(null);
    }, 250);
  };

  const navigate = (delta: number) => {
    if (showModal || newSelectorModal) return;
    const date = new Date(current);
    switch (view) {
      case "Week":
        date.setDate(date.getDate() + delta * 7);
        break;
      case "Month":
        date.setMonth(date.getMonth() + delta);
        break;
      default:
        date.setDate(date.getDate() + delta);
        break;
    }
    setCurrent(date.toString());
  };

  const calendarHandler = (dates?: [string, string]) => {
    if (dates) {
      const newDate = `${new Date(dates[0])}`;
      if (dates[0] !== newDate) setCurrent(newDate);
    }
  };

  const getFormattedDate = (date: Date, view: string) => {
    const newDateLocal = new Date(date);
    const firstDayWeek = newDateLocal.getDate() - (newDateLocal.getDay() - 1);
    const lastDayWeek = firstDayWeek + 6;

    const dataWeekFirst = new Date(newDateLocal.setDate(firstDayWeek));
    const dataWeekLast = new Date(newDateLocal.setDate(lastDayWeek));

    if (view === "Day") {
      return `${date.getDate()} ${
        DMonths[date.getMonth()]
      }, ${date.getFullYear()}`;
    }

    if (view === "Week") {
      return `${dataWeekFirst.getDate()} – ${dataWeekLast.getDate()} ${
        DMonths[dataWeekLast.getMonth()]
      }, ${dataWeekLast.getFullYear()}`;
    }
    return `${Months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const changeSearchValue = (name: string, value: string) => {
    setSearchValue(value);
  };

  const selectDayView = (day: string, view: CalendarViews) => {
    setCurrent(day);
    setView(view);
  };

  const converted = useMemo(() => convertItems(items), [items]);

  const filteredEvents = useMemo(() => {
    const id = getUserId();

    if (!filters.length) return converted;

    const filteredResult = items.filter((event) => {
      const currentUser = event.participants?.find(
        (user) => user.ext?.id === id
      );
      const isParticipant = !!currentUser;
      let isOtherRole = filters.includes(currentUser?.topology_type);
      let isOrganizer = false; // ???? @TODO добавить условие фильтрации "организатор"
      return isParticipant && (isOtherRole || isOrganizer);
    });

    return convertItems(filteredResult);
  }, [searchValue, filters, items]);

  useEffect(() => {
    if (focusedEvent) {
      setShowModal(true);
    }
  }, [focusedEvent]);

  const calendarInitial = useMemo(() => {
    const d = format(new Date(current), "yyyy-MM-dd");
    return [d, d] as [string, string];
  }, [current]);

  const activeFilters = useMemo((): Filters => {
    const filters: Filters = {};
    if (searchValue) {
      filters.search = searchValue;
    }
    return filters;
  }, [searchValue]);

  const slideStyles = useMemo(() => {
    switch (true) {
      case isTablet || breakpoint === "lg":
        return SlideTabletStyles;
      case isMobile:
        return SlideMobileStyles;
      default:
        return SlideStyles;
    }
  }, [breakpoint]);

  const isModalPorted =
    ["lg", "md", "xs"].includes(breakpoint) || isTouchDevice;

  const renderModalWrapper = (content: JSX.Element) => {
    return isModalPorted ? (
      <Portal id="header-modal">{content}</Portal>
    ) : (
      content
    );
  };

  const renderToolbar = () => {
    return isDesktop ? (
      <div className={styles.Toolbar}>
        <div className={styles.Date}>
          {getFormattedDate(new Date(current), view)}
        </div>

        {breakpoint === "xl" ? (
          <>
            <div className={styles.ToolbarButtons}>
              <DateNavButton type="back" onClick={() => navigate(-1)} />
              <DateNavButton type="forward" onClick={() => navigate(1)} />
            </div>
            {!isTouchDevice ? (
              <AddButton
                size={isDesktop ? 40 : 48}
                onClick={() => createSelectorWithDate()}
                className={styles[`AddButton-${breakpoint}`]}
              />
            ) : null}
          </>
        ) : null}

        <div className={styles.Spacer} />

        <ViewToggler views={ViewTypes} active={view} actionHandler={setView} />

        {showSearch ? (
          <Search onChange={changeSearchValue} />
        ) : (
          <button className={styles.Search} onClick={() => setShowSearch(true)}>
            <img src="svg/searchBlack.svg" alt="Search" />
          </button>
        )}
      </div>
    ) : (
      <Toolbar
        view={view}
        filters={activeFilters}
        title={getFormattedDate(new Date(current), view)}
        initialDate={calendarInitial}
        selectors={filteredEvents as any as IBasicObject[]}
        setView={(v) => setView(v)}
        setDate={(name, value) => calendarHandler(value)}
        setSearch={changeSearchValue}
      />
    );
  };

  const modalTopOffset = isModalPorted ? 0 : view === "Month" ? 40 : 0;

  return (
    <div
      className={clsx(
        commonStyles.Grid,
        styles.Screen,
        styles[`Screen-${breakpoint}`],
        { [styles.ScreenMobile]: isTouchDevice }
      )}
    >
      {isDesktop ? (
        <div className={styles.Sidebar}>
          <CalendarPicker
            initial={calendarInitial}
            highlightMode={view}
            onChange={(name, value) => calendarHandler(value)}
          />
        </div>
      ) : null}

      <div className={styles.Calendar}>
        {renderToolbar()}
        {isTouchDevice ? (
          <AddButton
            size={isDesktop ? 40 : 48}
            onClick={() => createSelectorWithDate()}
            className={styles.AddButtonMobile}
          />
        ) : null}
        <TouchEvents
          id="calendar-workspace"
          className={styles.Root}
          onSwipeLeft={() => navigate(1)}
          onSwipeRight={() => navigate(-1)}
        >
          <ScrollContext.Provider value={scrolled}>
            <CalendarScheduler
              items={filteredEvents}
              view={view}
              current={current}
              setCurrent={setCurrent}
              searchValue={searchValue}
              scrolled={scrolled}
              actionHandler={actionHandler}
              selectDayView={selectDayView}
              handleModal={handleModal}
              handleEventScroll={handleEventScroll}
              createNewSelector={createSelectorWithDate}
            />
          </ScrollContext.Provider>

          {renderModalWrapper(
            <Slide
              direction="left"
              in={showModal}
              style={{
                ...slideStyles,
                top: modalTopOffset,
              }}
            >
              <div
                className={clsx(
                  styles.Slide,
                  modalStyles[`SelectorModal-${breakpoint}`],
                  { [modalStyles.SelectorModalMobile]: isTouchDevice }
                )}
              >
                {focusedEvent ? (
                  <CalendarModal
                    data={focusedEvent}
                    onClose={setShowModal}
                    search={searchValue}
                    actionHandler={actionHandler}
                    className="ModalContent"
                  />
                ) : null}
              </div>
            </Slide>
          )}
          {renderModalWrapper(
            <Slide
              direction="left"
              in={newSelectorModal}
              style={{
                ...slideStyles,
                top: modalTopOffset,
              }}
            >
              <div
                className={clsx(
                  styles.Slide,
                  modalStyles[`SelectorModal-${breakpoint}`],
                  { [modalStyles.SelectorModalMobile]: isTouchDevice }
                )}
              >
                {newSelector ? (
                  <CreateSelectorModal
                    initial={newSelector}
                    onClose={closeNewSelectorModal}
                    onSave={refreshEventModal}
                    className="ModalContent"
                  />
                ) : null}
              </div>
            </Slide>
          )}
        </TouchEvents>
      </div>
    </div>
  );
}
