import React, {
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import Format from "date-fns/format";
import { Avatar } from "@oktell/header-panel";
import { Icon } from "@oktell/icons";
import { CalendarPicker } from "@oktell/inputs";
import Dialog from "@material-ui/core/Dialog";
import clsx from "clsx";
import reactStringReplace from "react-string-replace";

import { ParticipantsTab } from "components/pages/blocks/SelectorPage/Tabs/Participants/Tab";
import { SlideModal } from "components/common/Modal/SlideModal";
import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { SelectorViewBar } from "components/pages/blocks/CalendarPage/blocks/SelectorViewBar";
import { RadioButton } from "components/common/Inputs/RadioButton";
import { PopUpList } from "components/common/UI/PopUpList";

import { AddUsersModal } from "./blocks/AddUsersModal";
import { TimesList } from "./blocks/CalendarModal/TimesList";
import { MobileSlideModal } from "./blocks/CalendarModal/MobileSlideModal";
import { CompactUserItem } from "../SelectorPage/Tabs/Participants/CompactUserItem";
import { StatusBar } from "./blocks/StatusBar";
import { MobileModalHeader } from "./blocks/MobileHeader";
import { SelectorVotings } from "../SelectorModal/SelectorVotings";
import { CancelToast } from "./blocks/CalendarModal/CancelToast";
import { CompactUserItemMobile } from "../SelectorPage/Tabs/Participants/CompactUserItemMobile";

import {
  ActionHandler,
  CallUser,
  Participant,
  SelectorEvent,
} from "../SelectorPage/types";
import { IBasicObject } from "types/index";
import { FormKeys } from "../TemplateModal/enums";
import { ActionTypes, CoreEntities, RequestMethods } from "types/enums";
import { MenuItemTypes } from "store/menu/enums";

import { getBreakPoint } from "store/core/getters";
import { getCurrentAction } from "store/content/getters";

import { Days } from "./consts";
import { copy } from "utils/copy";
import { getLocalDate } from "utils/dateConverters";
import { apiRequest, requestUrl } from "utils/apiRequest";
import { userConverter } from "../SelectorPage/utils";
import {
  extractTimeValuesFromSelector,
  injectTimeValuesInSelector,
} from "./helpers";
import { defaultTimes } from "../SelectorModal/consts";

import styles from "./Modal.module.scss";

interface ToastPayload {
  title: string;
  revertAction: string;
  revertPayload: IBasicObject;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: SelectorEvent;
  readonly?: boolean;
  search?: string;
  onClose?: (state: boolean) => void;
  actionHandler?: ActionHandler;
}

export const CalendarModal: React.FC<Props> = ({
  data,
  readonly,
  search,
  onClose,
  actionHandler = () => null,
  className,
  ...restProps
}) => {
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeStart, setShowTimeStart] = useState(false);
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const [showAllUsersModal, setShowAllUsersModal] = useState(false);

  const [showToast, setShowToast] = useState<ToastPayload | null>(null);

  const wrapper = useRef(null);

  const [allUsers, setAllUsers] = useState<CallUser[]>([]);
  const [tempValues, setTempValues] = useState<IBasicObject>({});

  const activeMenu = useSelector(getCurrentAction);
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  const owner = data.owner || "";
  const isRunning = data.enabled;

  const rest = data.participants.length - 5;
  const titleModal = data?.title || data?.displayname;

  const runSelector = () => {
    readonly
      ? actionHandler("dbclick", { id: data.id })
      : actionHandler("start", data.id);
  };

  const removeSelector = async () => {
    await actionHandler("delete", [{ id: data.id }]);
    onClose(false);
  };

  const editSelector = async () => {
    const payload = JSON.parse(JSON.stringify(data));
    actionHandler("selector_edit", payload);
  };

  const copySelector = async () => {
    const payload = JSON.parse(JSON.stringify(data));
    actionHandler("selector_copy", payload);
  };

  const getSelectorPayload = (form = tempValues) => {
    const selector = { ...data, ...form } as any as IBasicObject;
    delete selector.templates;
    delete selector.startDate;
    delete selector.endDate;
    return selector;
  };

  const getUserList = async () => {
    const ACTION = {
      action: ActionTypes.get,
      entity: CoreEntities.content,
      options: {
        code: MenuItemTypes.lists,
      },
    };
    const res = await apiRequest({
      data: ACTION,
      method: RequestMethods.POST,
      url: requestUrl,
    });
    const users = res?.data?.data;

    if (users && users.length) {
      setAllUsers(users.map((user: Participant) => userConverter(user)));
    }

    setShowAllUsersModal(true);
  };

  const activateToast = (payload: ToastPayload = null) => {
    setShowToast(payload);
  };

  const onToastClose = () => {
    setShowToast(null);
  };

  const onToastCancel = async () => {
    actionHandler(showToast.revertAction, showToast.revertPayload);
    setShowToast(null);
  };

  const settingsHandler: ActionHandler = async (name, payload) => {
    const PAYLOAD = JSON.parse(JSON.stringify(data)) as IBasicObject;
    const settingValue = (payload as { [key: string]: number | boolean }) || {};
    const button = Object.keys(settingValue)[0];
    const setting = settingValue[button];
    switch (button) {
      case "mic":
        PAYLOAD[FormKeys.mic] = setting as boolean;
        break;
      case "dynamic":
        PAYLOAD[FormKeys.speaker] = setting as boolean;
        break;
      case "recall":
        PAYLOAD[FormKeys.recall] = setting as boolean;
        break;
      case "calltime":
        PAYLOAD[FormKeys.duration] = setting as number;
        break;
      default:
        break;
    }
    actionHandler(name, PAYLOAD);
  };

  const menuHandler = (key: string) => {
    switch (key) {
      case "start":
        runSelector();
      case "copy":
        copySelector();
        break;
      case "edit":
        editSelector();
        break;
      case "delete":
        removeSelector();
        break;
      default:
        break;
    }
  };

  const userActionHandler: ActionHandler = async (
    action,
    payload: IBasicObject
  ) => {
    switch (action) {
      case "remove":
        activateToast({
          title: "Участник удалён",
          revertAction: "add",
          revertPayload: { participant: payload.user as IBasicObject },
        });
      default:
        actionHandler(action, payload);
        break;
    }
  };

  const votingActionHandler: ActionHandler = async (action, payload) => {
    // return;
    switch (action) {
      case "delete_voting":
        actionHandler(action, { votingId: (payload as any).voting?.id });
        if (!isDesktop) {
          activateToast({
            title: "Опрос удалён",
            revertAction: "add_voting",
            revertPayload: payload as IBasicObject,
          });
        }
        break;
      default:
        actionHandler(action, payload);
        break;
    }
  };

  const tempFormHandler = (name: string, value: string | [string, string]) => {
    const source = tempValues ? copy(tempValues) : {};
    const [startDate, startTime, endTime] = selectorTimeValues;

    switch (name) {
      case FormKeys.timeStartUTC:
        injectTimeValuesInSelector({
          selector: data,
          accumulator: source,
          startDate: value?.[0] || startDate,
          startTime,
          endTime,
        });
        setTempValues(source);
        break;
      case "timestart":
        injectTimeValuesInSelector({
          selector: data,
          accumulator: source,
          startDate,
          startTime: (value as string) || startTime,
          endTime,
        });
        confirmDateTimeChange(source);
        break;
      case "timeend":
        /* не работает на стороне бекенда */
        injectTimeValuesInSelector({
          selector: data,
          accumulator: source,
          startDate,
          startTime,
          endTime: (value as string) || endTime,
        });
        confirmDateTimeChange(source);
        break;
      default:
        break;
    }
  };

  const closeDateModal = () => {
    setTempValues({});
    setShowCalendar(false);
  };

  const closeTimeStartModal = () => {
    setTempValues({});
    setShowTimeStart(false);
  };

  const closeTimeEndModal = () => {
    setTempValues({});
    setShowTimeEnd(false);
  };

  const confirmDateTimeChange = async (payload?: IBasicObject) => {
    const selector = getSelectorPayload(payload);
    await actionHandler("update", {
      code: activeMenu.options.code,
      selector,
    });
    closeDateModal();
    closeTimeEndModal();
    closeTimeStartModal();
  };

  const title = useMemo(() => {
    return search
      ? reactStringReplace(titleModal, search, (match, index) => (
          <span key={index} className={styles.ModalSearchActive}>
            {match}
          </span>
        ))
      : titleModal;
  }, [search, titleModal]);

  const selectorTimeValues = useMemo(() => {
    return extractTimeValuesFromSelector(data);
  }, [data]);

  const initialCalendarDate = useMemo(() => {
    const rawTemp = tempValues?.[FormKeys.timeStartUTC] as string;
    const localDate = rawTemp
      ? getLocalDate(
          tempValues?.[FormKeys.timeStartUTC] as string,
          "yyyy-MM-dd HH:mm"
        )
      : null;
    const value = localDate || selectorTimeValues[0];
    return [value, value] as [string, string];
  }, [selectorTimeValues, tempValues]);

  const initialStartTime = useMemo(() => {
    return (tempValues.timestart || selectorTimeValues[1]) as string;
  }, [selectorTimeValues, tempValues]);

  const initialEndTime = useMemo(() => {
    return (tempValues.timeend || selectorTimeValues[2]) as string;
  }, [selectorTimeValues, tempValues]);

  const startTimes = useMemo(() => {
    return defaultTimes(4, 22);
  }, [selectorTimeValues]);

  const endTimes = useMemo(() => {
    const [hours, minutes] = selectorTimeValues[1]
      .split(":")
      .map((n) => parseInt(n, 10));

    return defaultTimes(hours, 22, 15, minutes, true);
  }, [selectorTimeValues]);

  const selectorMenu = useMemo(() => {
    return isRunning
      ? {
          start: "Перейти",
          copy: "Скопировать",
          delete: "Удалить",
        }
      : {
          start: "Запустить",
          copy: "Скопировать",
          edit: "Редактировать",
          delete: "Удалить",
        };
  }, [isRunning]);

  const renderTimeBlock = () => {
    if (!data.timestartutc) return null;

    let formattedDate = "";

    const [date, timeStart, timeEnd] = selectorTimeValues;

    const localDate = getLocalDate(date, undefined, true) as Date;
    const dayWeek = localDate?.getDay();
    formattedDate = Format(localDate, "dd.MM.yyyy");

    return (
      <>
        <span>{Days[dayWeek]}</span>
        <span
          className={clsx(styles.ModalContentDateButton, {
            [styles.ModalContentDateButtonDisabled]: isRunning || readonly,
          })}
          onClick={() => setShowCalendar(true)}
        >
          {formattedDate}
        </span>
        c
        <span
          className={clsx(styles.ModalContentDateButton, {
            [styles.ModalContentDateButtonDisabled]: isRunning || readonly,
          })}
          onClick={() => setShowTimeStart(true)}
        >
          {timeStart}
        </span>
        по
        <span
          className={clsx(styles.ModalContentDateButton, {
            [styles.ModalContentDateButtonDisabled]: isRunning || readonly,
          })}
          onClick={() => setShowTimeEnd(true)}
        >
          {timeEnd}
        </span>
      </>
    );
  };

  const renderHeader = () => {
    return isDesktop ? (
      <>
        <div className={styles.ModalHeader}>
          <div className={clsx(styles.ModalAction, "readonly")}>
            <button className={styles.ModalActionButton} onClick={copySelector}>
              Скопировать
            </button>
            {!isRunning ? (
              <button
                className={styles.ModalActionButton}
                onClick={editSelector}
              >
                Редактировать
              </button>
            ) : null}
            <button
              className={styles.ModalActionButton}
              onClick={removeSelector}
            >
              Удалить
            </button>
          </div>
          <button
            className={styles.ModalActionClose}
            onClick={() => onClose(false)}
          >
            <Icon name="close" />
          </button>

          <div className={styles.ModalContentTitle}>{title}</div>
        </div>
      </>
    ) : (
      <>
        <MobileModalHeader
          leftIcon="close"
          leftIconAction={() => onClose(false)}
          rightSlot={
            !readonly ? (
              <PopUpList items={selectorMenu} onClick={menuHandler}>
                <Icon name="menudots" className={styles.ModalActionsIcon} />
              </PopUpList>
            ) : null
          }
        >
          <div>{title}</div>
        </MobileModalHeader>
        <MobileSlideModal
          title="Выберите дату"
          show={showCalendar}
          leftIconAction={closeDateModal}
          rightIcon={tempValues ? "check" : null}
          rightIconAction={() => confirmDateTimeChange()}
        >
          <CalendarPicker
            name="timestartutc"
            initial={initialCalendarDate}
            monthsAmount={2}
            onChange={tempFormHandler}
          />
        </MobileSlideModal>

        <CancelToast
          show={!!showToast}
          title={showToast?.title}
          onCancel={onToastCancel}
          onClose={onToastClose}
        />

        <Dialog
          container={wrapper.current}
          onClose={closeTimeStartModal}
          open={showTimeStart}
        >
          <TimesList
            active={initialStartTime}
            items={startTimes}
            onItemClick={(value) => tempFormHandler("timestart", value)}
          />
        </Dialog>

        <Dialog
          container={wrapper.current}
          onClose={closeTimeEndModal}
          open={showTimeEnd}
        >
          <TimesList
            active={initialEndTime}
            items={endTimes}
            onItemClick={(value) => tempFormHandler("timeend", value)}
          />
        </Dialog>
      </>
    );
  };

  const renderDivider = (offset?: boolean) => {
    return isDesktop ? (
      <div
        className={clsx(styles.ModalDivider, { [styles.ModalMargin]: offset })}
      ></div>
    ) : null;
  };

  const renderUserItem = (user: CallUser, index: number) => {
    return isDesktop ? (
      <CompactUserItem
        key={index}
        user={user}
        search={search}
        video={data.is_video}
        videoIcon={data.video_mode}
        showActions
        disabled
      />
    ) : (
      <CompactUserItemMobile
        readonly={readonly}
        key={user.id}
        user={user}
        search={search}
        video={data.is_video}
        videoIcon={data.video_mode}
        actionHandler={userActionHandler}
      />
    );
  };

  return (
    <div
      ref={wrapper}
      className={clsx(
        styles.Modal,
        { [styles.Readonly]: readonly },
        styles[`Modal-${breakpoint}`],
        className
      )}
      {...restProps}
    >
      {renderHeader()}

      <ScrollContainer>
        <div className={styles.ModalContent}>
          {data?.comment ? (
            <div className={styles.ModalContentDescription}>{data.comment}</div>
          ) : null}

          {isRunning ? (
            <div className={styles.SelectorActive}>Проводится сейчас</div>
          ) : null}

          <div className={styles.ModalContentDate}>{renderTimeBlock()}</div>

          <div className={styles.ModalContentOwners}>
            {owner ? (
              <div className={styles.ModalContentOwnersItem}>
                <div className={styles.ModalOwner}>
                  <Avatar size={24} name={owner} />
                  <span>{owner}</span>
                </div>
                <div className={styles.ModalOwnerTitle}>(организатор)</div>
              </div>
            ) : null}
          </div>

          <div className={styles.ModalType}>
            <div>Тип селектора</div>
            <RadioButton
              value={"video"}
              initial={data.is_video}
              label={"Видео"}
              readonlyRadio
            />
            <RadioButton
              name={FormKeys.isVideo}
              value={"audio"}
              initial={!data.is_video}
              label={"Аудио"}
              readonlyRadio
            />
          </div>

          <div className={styles.ModalMembers}>
            <div className={styles.ModalMembersHeader}>
              <span className={styles.ModalMembersTitle}>
                Участники ({data.participants?.length})
                <Icon
                  name="addressbook"
                  className={styles.ModalMembersTitleButton}
                  onClick={getUserList}
                />
              </span>

              <AddUsersModal
                show={showAllUsersModal}
                addedUsers={data?.participants || []}
                users={allUsers}
                actionHandler={actionHandler}
                onClose={() => setShowAllUsersModal(false)}
              />
            </div>

            <div className={styles.ModalMembersList}>
              {data.participants?.slice(0, 5).map(renderUserItem)}
            </div>
            {rest > 0 ? (
              <div
                className={styles.ModalMembersMore}
                onClick={() => setShowUsersModal(true)}
              >
                и еще {rest}
              </div>
            ) : null}
          </div>

          <SlideModal
            show={showUsersModal}
            header={<div>Участники</div>}
            onClose={() => setShowUsersModal(false)}
          >
            <ParticipantsTab
              actionHandler={actionHandler}
              users={data.participants || []}
              className={styles.Participants}
            />
          </SlideModal>

          <div className={styles.ModalPolls}>
            <SelectorVotings
              controlled={isRunning}
              votings={data.votings || []}
              users={data.participants}
              search={search}
              edit={!isRunning && !readonly}
              notCreate={isRunning}
              actionHandler={votingActionHandler}
            />
          </div>
        </div>

        {renderDivider(true)}

        {isRunning ? null : (
          <div className={clsx(styles.ModalActions, "readonly")}>
            <StatusBar
              // hideItems={["dynamic", "calltime"]}
              initialValues={{
                dynamic: !!data.default_spk,
                mic: !!data.default_mic,
                recall: !!data.default_recall,
                calltime: data.calldurationsec,
              }}
              actionHandler={settingsHandler}
            />
          </div>
        )}

        {data.is_video ? (
          <>
            <div className={styles.ModalViewBar}>
              <SelectorViewBar
                initial={data.video_mode}
                usersCount={data?.participants.length}
                readonlyView
              />
            </div>
          </>
        ) : null}
      </ScrollContainer>

      <div className={clsx(styles.ModalFooter)}>
        {renderDivider()}
        <div className={styles.ModalStart}>
          <button className={styles.ModalStartButton} onClick={runSelector}>
            {readonly
              ? "Посмотреть запись селектора"
              : data.enabled
              ? "Перейти в селектор"
              : " Запустить селектор"}
          </button>
        </div>
      </div>
    </div>
  );
};
