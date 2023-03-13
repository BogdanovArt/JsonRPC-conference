import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import { format } from "date-fns";

import { MobileModalHeader } from "../CalendarPage/blocks/MobileHeader";
import { YearMonthPicker } from "components/common/Inputs/DatePicker";
import { Input } from "components/common/Inputs/Input";
import { Textarea } from "components/common/Inputs/Textarea";
import { DropDown } from "components/common/Inputs/Select";
import { Button } from "components/common/UI/Button";
import { CheckBox } from "components/common/Inputs/CheckBox";
import {
  RepeatPayload,
  RepeatSelector,
} from "components/pages/blocks/SelectorModal/RepeatSelector";
import { SlideModal } from "components/common/Modal/SlideModal";
import { StatusBar } from "components/pages/blocks/CalendarPage/blocks/StatusBar";
import { CompactUserItem } from "components/pages/blocks/SelectorPage/Tabs/Participants/CompactUserItem";
import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { SelectorVotings } from "./SelectorVotings";
import { AddUsersModal } from "../CalendarPage/blocks/AddUsersModal";
import { RadioButton } from "components/common/Inputs/RadioButton";
import { SelectorViewBar } from "components/pages/blocks/CalendarPage/blocks/SelectorViewBar";
import { Modal } from "components/common/Modal/Modal";
import { VideoPlaceSelect } from "components/pages/blocks/CalendarPage/blocks/VideoPlaceSelect";

import { requestContentData } from "store/content/actions";
import { getCurrentAction } from "store/content/getters";
import { getBreakPoint } from "store/core/getters";

import { GenericAction, SelectorForm } from "store/content/types";
import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  RequestMethods,
} from "types/enums";
import { ModalContexts } from "store/content/enums";
import { FormKeys } from "../TemplateModal/enums";
import { IBasicObject } from "types/index";
import {
  CallUser,
  Participant,
  Selector,
  Topology,
  Voting,
} from "../SelectorPage/types";
import { apiRequest, requestUrl } from "utils/apiRequest";
import { MenuItemTypes } from "store/menu/enums";

import {
  getDateFromTime,
  getGlobalDate,
  getReadableDuration,
} from "utils/dateConverters";

import { copy } from "utils/copy";
import { defaultTimes } from "./consts";
import { userConverter } from "../SelectorPage/utils";
import isDate from "utils/isDate";
import { AppDispatch } from "store/index";

import styles from "./CreateSelector.module.scss";

const times = defaultTimes(6, 22);

const getDateFromUTCString = (dateString?: string) => {
  const newDate = new Date(dateString);
  return isDate(newDate) ? newDate : null;
};

const getDurationString = (value: string, time: string) => {
  if (value && time) {
    const durationValue = getDateFromTime(value as string);
    const timeStartValue = getDateFromTime(time);
    const durationTime = durationValue.getTime() - timeStartValue.getTime();
    const durationTimeMinutes = durationTime / 1000 / 60;
    const delta = getReadableDuration(durationValue, timeStartValue);

    return { durationTimeMinutes, delta };
  }
  return {};
};

interface Props {
  readonly?: boolean;
  initial: SelectorForm;
  title?: string;
  onSave?: (selector?: SelectorForm & Selector) => void;
  onClose?: () => void;
}

interface UserChipPL {
  id: string;
  index: number;
}

export const CreateSelectorForm = ({
  initial = {},
  readonly = false,
  title,
  onSave = () => null,
  onClose = () => null,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeMenu = useSelector(getCurrentAction);

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  const [form, setForm] = useState(initial);
  const [repeat, setRepeat] = useState(false);
  const [repeatModal, setRepeatModal] = useState(false);
  const [userModal, setUsersModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMoreUsers, setShowMoreUsers] = useState(false);

  const [users, setUsers] = useState<CallUser[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const [duration, setDuration] = useState("");

  const UTC = useMemo(() => {
    return getDateFromUTCString(initial[FormKeys.timeStartUTC]);
  }, []);

  const initialDate = useMemo(() => {
    return UTC ? format(UTC, "yyyy-MM-dd") : null;
  }, [UTC]);

  const initialTime = useMemo(() => {
    return UTC ? format(UTC, "HH:mm") : null;
  }, [UTC]);

  const showUserCount = showMoreUsers ? form.participants?.length : 5;

  const durationTimes = useMemo(() => {
    if (!time) return;
    const [hours, minutes] = time.split(":").map((n) => parseInt(n, 10));
    return defaultTimes(hours, 22, 15, minutes, true);
  }, [time]);

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
      setUsers(users.map((user: Participant) => userConverter(user)));
    }

    setUsersModal(true);
  };

  const setReadableDuration = () => {
    if (!time || !timeEnd) {
      setDuration("");
      return;
    }
    const { delta } = getDurationString(timeEnd, time);
    setDuration(`селектор на ${delta}`);
  };

  const actionHandler = async (action: string, payload?: unknown) => {
    const clone = copy(form);

    switch (action) {
      case "add_users":
        const usersPl = payload as { users: CallUser[] };
        const currentUsers = clone.participants || [];
        const newUsers = usersPl.users;
        // save current user's settings (topology_type e.t.c);
        newUsers.forEach((user, index) => {
          const match = currentUsers.find(
            (current) => current.number === user.number
          );
          if (match) {
            newUsers[index] = match;
          }
        });

        clone.participants = newUsers;
        clone.video_mode = "1";
        setUsers([]);
        break;
      case "save_voting":
        const editedVoting = (payload as IBasicObject).voting as any as Voting;
        const votingIndex = (payload as IBasicObject).index as number;
        clone.votings[votingIndex] = editedVoting;
        break;
      case "add_voting":
        const addPl = payload as { voting: Voting };
        const votings = clone.votings;
        if (votings) {
          votings.push(addPl.voting);
        } else {
          clone.votings = [addPl.voting];
        }
        break;
      case "delete_voting":
        const deletePl = payload as { voting: Voting; index: number };
        if (deletePl.index !== null && deletePl.index !== undefined) {
          clone.votings?.splice(deletePl.index, 1);
        }
        break;
      case "add":
        const addUser = payload as { participant: CallUser };
        const participants = clone.participants;
        if (participants) {
          participants.push(addUser.participant);
        } else {
          clone.participants = [addUser.participant];
        }
        break;
      case "topology_type":
        interface TopologyPLType extends UserChipPL {
          type: Topology;
        }
        const topologyPL = payload as TopologyPLType;
        clone.participants[topologyPL.index].topology_type = topologyPL.type;
        break;
      case "remove":
        const plRemoveUser = payload as UserChipPL;
        clone.participants?.splice(plRemoveUser.index, 1);
        break;
      case "mic":
        const plMicUser = payload as UserChipPL;
        clone.participants[plMicUser.index].mic = !clone.participants[plMicUser.index].mic;
        break;
      case "cam":
        const plCamUser = payload as UserChipPL;
        clone.participants[plCamUser.index].video_out = !clone.participants[plCamUser.index].video_out;
        break;
      default:
        break;
    }

    // console.log(clone);
    setForm(clone);
  };

  const inputHandler = async (name: string, value?: unknown) => {
    const formCopy = copy(form);
    switch (name) {
      case FormKeys.days:
        formCopy[FormKeys.repeat][FormKeys.days] = value as number[];
        break;
      case FormKeys.mode:
        formCopy[FormKeys.repeat][FormKeys.mode] = value as number;
        switch (value) {
          case 1:
            formCopy[FormKeys.repeat][FormKeys.days] = [];
            formCopy[FormKeys.repeatCount] = 1;
            break;
          case 4:
            setRepeatModal(true);
            break;
          default:
            break;
        }
        break;
      case FormKeys.date:
        setDate(value as string);
        break;
      case FormKeys.time:
        setTime(value as string);
        if (timeEnd && timeEnd <= (value as string)) setTimeEnd("");
        break;
      case FormKeys.durationPlan:
        setTimeEnd(value as string);
        if (value && time) {
          const { durationTimeMinutes } = getDurationString(
            value as string,
            time
          );
          formCopy[FormKeys.ext][name] = durationTimeMinutes;
        }
        break;
      case "repeat_select":
        const repeatPl = value as RepeatPayload;
        if (repeatPl?.repeat) formCopy[FormKeys.repeat] = repeatPl.repeat;
        if (repeatPl?.repeat_count)
          formCopy[FormKeys.repeatCount] = repeatPl.repeat_count;
        setRepeatModal(false);
        break;
      case FormKeys.repeat:
        setRepeat(value as boolean);
        if (!value) {
          formCopy[FormKeys.repeat] = {
            [FormKeys.mode]: 1,
            [FormKeys.days]: [],
          };
          formCopy[FormKeys.repeatCount] = 1;
        }
        break;
      case "selector_call_settings":
        if (value) {
          const settingValue =
            (value as { [key: string]: number | boolean }) || {};
          const button = Object.keys(settingValue)[0];
          const setting = settingValue[button];
          switch (button) {
            case "mic":
              formCopy[FormKeys.mic] = setting as boolean;
              break;
            case "dynamic":
              formCopy[FormKeys.speaker] = setting as boolean;
              break;
            case "recall":
              formCopy[FormKeys.recall] = setting as boolean;
              break;
            case "calltime":
              formCopy[FormKeys.duration] = setting as number;
              break;
            default:
              break;
          }
        }
        break;
      case FormKeys.comment:
      case FormKeys.displayName:
        formCopy[name] = value as string;
        break;
      default:
        break;
    }

    setForm(formCopy);
  };

  useEffect(() => {
    const formCopy = JSON.parse(JSON.stringify(form));
    const localDate = !!date && !!time ? `${date} ${time}` : "";
    const UTCDate = getGlobalDate(localDate);

    formCopy[FormKeys.repeat][FormKeys.mode] = 1;
    formCopy[FormKeys.timeStartUTC] = UTCDate;

    setForm(formCopy);
  }, [date, time]);

  const saveHandler = async () => {
    let action: GenericAction;
    switch (initial.context) {
      case ModalContexts.edit:
        action = {
          action: ActionTypes.update,
          entity: ButtonEntities.SELECTOR_UPDATE,
        };
        break;
      default:
        action = {
          action: ActionTypes.create,
          entity: ButtonEntities.SELECTOR_SAVE,
        };
        break;
    }

    const Payload = { ...form };
    delete Payload.templates;
    delete Payload.entity;

    action.options = {
      code: activeMenu.options.code,
      selector: Payload,
    };

    const res = await dispatch(requestContentData(action));
    const items = (res.data as any)?.selectors;

    let selector;
    if (items) {
      const match = items.find(
        (selector: SelectorForm) => selector.id === initial?.id
      );
      selector = match || Payload;
    }
    onSave(selector as SelectorForm & Selector);
    onClose();
  };

  const editMode =
    initial.context === ModalContexts.edit ||
    initial.context === ModalContexts.readonly;

  const validEdit =
    !!form[FormKeys.displayName] && !!form[FormKeys.timeStartUTC];

  const validCreate =
    validEdit &&
    !!form[FormKeys.repeat]?.[FormKeys.mode] &&
    !!form[FormKeys.repeat]?.[FormKeys.days];

  const isValid = () => {
    switch (initial.context) {
      case ModalContexts.edit:
        return validEdit;
      default:
        return validCreate;
    }
  };

  const radioChange = (name: string, value?: unknown, checked?: unknown) => {
    const formCopy = copy(form);

    switch (name) {
      case FormKeys.isVideo:
        if (value === "video") {
          formCopy[FormKeys.isVideo] = checked as boolean;
        } else {
          formCopy[FormKeys.isVideo] = !checked as boolean;
        }
        break;
      case FormKeys.videoMode:
        formCopy[FormKeys.videoMode] = value as string;
        break;
      default:
        break;
    }

    setForm(formCopy);
  };

  const cancelRepeatModal = () => {
    setRepeat(false);
    setRepeatModal(false);
  };

  const toggleVideoModal = () => {
    setShowVideoModal(!showVideoModal);
  };

  useEffect(() => {
    if (repeat) setRepeatModal(true);
  }, [repeat]);

  const setUserCellVideo = (usersVideo: CallUser[]) => {
    const clone = copy(form);
    clone.participants = usersVideo;
    setForm(clone);
    setShowVideoModal(false);
  };

  useEffect(() => {
    // console.log(time, timeEnd);
    setReadableDuration();
  }, [time, timeEnd]);

  useEffect(() => {
    if (initial) {
      const date = getDateFromUTCString(initial[FormKeys.timeStartUTC]);
      if (date) {
        const start = format(date, "HH:mm");
        setTime(start);
      }
    }
    setForm(initial);
  }, [initial]);

  const renderHeader = (content: JSX.Element) => {
    return isDesktop ? (
      <>
        <Icon name="close" onClick={onClose} className={styles.Close} />
        {content}
      </>
    ) : (
      <MobileModalHeader
        leftIcon="close"
        rightIcon={!readonly && isValid() ? "check" : null}
        leftIconAction={onClose}
        rightIconAction={saveHandler}
      >
        {content}
      </MobileModalHeader>
    );
  };

  return (
    <>
      {renderHeader(<div className={styles.ModalTitle}>{title}</div>)}
      <ScrollContainer className={styles.Wrapper}>
        <Input
          name={FormKeys.displayName}
          label="Название совещания"
          placeholder={"Название селектора"}
          disabled={readonly}
          initial={form[FormKeys.displayName]}
          onChange={inputHandler}
        />

        <div className={clsx(styles.RowWrapper, styles.RowGap)}>
          <div>Тип селектора</div>
          <RadioButton
            name={FormKeys.isVideo}
            value={"video"}
            initial={form[FormKeys.isVideo]}
            label={"Видео"}
            onChange={radioChange}
          />
          <RadioButton
            name={FormKeys.isVideo}
            value={"audio"}
            initial={!form[FormKeys.isVideo]}
            label={"Аудио"}
            onChange={radioChange}
          />
        </div>

        <div className={styles.RowWrapper}>
          <label className={styles.Label}>Дата и время</label>
          <div className={styles.Row}>
            <div className={styles.Dates}>
              <YearMonthPicker
                disabled={readonly}
                name={FormKeys.date}
                initial={initialDate}
                onChange={inputHandler}
              />
            </div>

            <div className={styles.Times}>
              <DropDown
                compact
                name={FormKeys.time}
                placeholder="00:00"
                initial={initialTime || "10:00"}
                items={times}
                time
                onChange={inputHandler}
              />

              <DropDown
                compact
                disabled={!time}
                name={FormKeys.durationPlan}
                placeholder="00:00"
                initial={timeEnd}
                items={durationTimes}
                time
                popoptions={{
                  anchorOrigin: {
                    horizontal: "right",
                    vertical: "bottom",
                  },
                  transformOrigin: {
                    horizontal: "right",
                    vertical: "top",
                  },
                }}
                onChange={inputHandler}
              />
            </div>
          </div>

          <div className={clsx(styles.Row, styles.RowSpaced)}>
            {initial?.context !== ModalContexts.edit ? (
              <CheckBox
                label={"Повторять"}
                initial={repeat}
                name={FormKeys.repeat}
                big
                reverse
                onChange={inputHandler}
              />
            ) : (
              <span></span>
            )}

            {duration}
          </div>
        </div>

        <Textarea
          name={FormKeys.comment}
          placeholder="Описание селектора"
          disabled={readonly}
          initial={form[FormKeys.comment]}
          onChange={inputHandler}
        />

        <div className={styles.Members}>
          <div className={styles.MembersHeader}>
            <span className={styles.MembersTitle}>Участники</span>
            <Icon
              name="addressbook"
              className={styles.IconButton}
              onClick={getUserList}
            />
            <AddUsersModal
              show={userModal}
              addedUsers={form?.participants || []}
              users={users}
              actionHandler={actionHandler}
              onClose={() => setUsersModal(false)}
            />
          </div>
          <ScrollContainer className={styles.MembersList}>
            {form.participants?.slice(0, showUserCount).map((user, index) => (
              <CompactUserItem
                key={index}
                user={user}
                video={form.is_video}
                videoIcon={form.video_mode}
                showActions
                showVideoModal={toggleVideoModal}
                actionHandler={(action, payload: IBasicObject) =>
                  actionHandler(action, { ...payload, index })
                }
              />
            ))}
          </ScrollContainer>

          {!showMoreUsers && form.participants?.length && form.participants?.length > 5 ? (
              <div className={styles.MoreButton} onClick={() => setShowMoreUsers(true)}>и еще {form.participants?.length - 5}</div>
          ) : null}
        </div>

        <SelectorVotings
          edit
          votings={form.votings || []}
          users={form?.participants || []}
          actionHandler={actionHandler}
        />

        <div className={styles.StatusBar}>
          <StatusBar
            initialValues={{
              dynamic: form.default_spk,
              mic: form.default_mic,
              recall: form.default_recall,
              calltime: form.calldurationsec,
            }}
            actionHandler={inputHandler}
          />
        </div>

        {form[FormKeys.isVideo] && form.participants.length ? (
          <div className={styles.SelectorViewBar}>
            <SelectorViewBar
              onChange={radioChange}
              initial={form.video_mode}
              usersCount={form.participants.length}
            />
          </div>
        ) : null}

        <SlideModal
          show={repeatModal}
          header={<div>Повторы</div>}
          footer={
            <>
              <Button
                color="var(--accent-color)"
                className={styles.Button}
                onClick={cancelRepeatModal}
              >
                Отмена
              </Button>
              <div id="repeat-portal" />
            </>
          }
          onClose={cancelRepeatModal}
        >
          <RepeatSelector
            name="repeat_select"
            repeat={form.repeat}
            repeat_count={form.repeat_count}
            returnValue={inputHandler}
          />
        </SlideModal>
      </ScrollContainer>

      <Modal
        show={showVideoModal}
        wide
        content={
          <VideoPlaceSelect
            saveItems={setUserCellVideo}
            onClose={toggleVideoModal}
            users={form.participants}
            videoMode={form.video_mode}
          />
        }
        onClose={toggleVideoModal}
      />

      {isDesktop ? (
        <div className={clsx(styles.FormControls, "FormControls")}>
          <Button
            color="var(--accent-color)"
            className={styles.Button}
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button disabled={readonly || !isValid()} dark onClick={saveHandler}>
            {initial?.context === ModalContexts.create
              ? "Создать"
              : "Сохранить"}
          </Button>
        </div>
      ) : null}
    </>
  );
};
