import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Avatar } from "@oktell/header-panel";
import { Icon, IconName } from "@oktell/icons";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

import { EventContentProps, EventType } from "./types";
import {
  ActionHandler,
  CallUser,
  CallUserExt,
} from "../../../SelectorPage/types";

import { searchResults } from "./utils";

import styles from "./Events.module.scss";
import { EventItem } from "../../Calendar";

interface StartIconProps {
  show?: boolean;
  enabled?: boolean;
  name?: IconName;
  clickHandler?: () => void;
}

const StartIcon: React.FC<StartIconProps> = ({
  show,
  enabled,
  name,
  clickHandler,
}) => {
  if (!show) return null;
  return (
    <div className={styles.EventStartIcon} onClick={clickHandler}>
      <Icon
        name={name}
        className={clsx(styles.EventIcon, {
          [styles.EventIconPlay]: !enabled,
        })}
      />
    </div>
  );
};

export const EventContent: React.FC<EventContentProps> = ({
  owner,
  title,
  comment,
  timeStart,
  timeEnd,
  participants,
  controls,
  clickHandler,
  className,
}) => {
  return (
    <div
      className={clsx(styles.EventContent, className)}
      onClick={clickHandler}
    >
      <div className={styles.EventHeader}>
        <div className={styles.EventTitle}>{title}</div>
        {controls}
      </div>
      <div className={styles.EventTime}>{`${timeStart}-${timeEnd}`}</div>

      {comment ? (
        <div className={styles.EventDescription}>{comment}</div>
      ) : null}

      <div className={styles.Avatars}>
        {participants?.map((item: CallUser & CallUserExt) => (
          <Avatar
            key={item.number}
            size={24}
            name={item.name}
            // photo="/some/photo/link.png"
          />
        ))}

        {participants?.length > 4 ? (
          <div className={styles.AvatarsCount}>+{participants?.length - 4}</div>
        ) : null}
      </div>
      <div className={styles.EventHint}>{owner}</div>
    </div>
  );
};

export const EventComponent: EventType = ({
  children,
  search,
  type,
  eventClick,
  actionHandler,
  ...restProps
}) => {
  const [showPop, setShowPop] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timer>(null);

  const anchor = useRef<HTMLDivElement>(null);

  const timeStart = (restProps.data?.startDate as Date)
    .toLocaleTimeString()
    .slice(0, -3);
  const timeEnd = (restProps.data?.endDate as Date)
    .toLocaleTimeString()
    .slice(0, -3);

  const results = searchResults(restProps.data, search);
  const enabled = restProps.data.enabled;
  const startIcon = enabled ? "record" : "play";
  const startDate = new Date(restProps.data.startDate);
  const nowDate = new Date();
  const showStartIcon = enabled || startDate.getTime() <= nowDate.getTime();
  const eventId = restProps.data.id as string;
  const comment = restProps.data.comment || "";

  const clickHandler = () => {
    const item = restProps.data as EventItem | null;
    eventClick(item);
  };

  const eventClickHandler = ({
    target,
    data,
  }: {
    target: HTMLDivElement;
    data: EventItem;
  }) => {
    eventClick(data);
  };

  const onMouseEnter = () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setShowPop(true);
      }, 500)
    );
  };

  const onMouseLeave = () => {
    clearTimeout(timer);
    setShowPop(false);
  };

  const Start = (
    <StartIcon
      show={showStartIcon}
      enabled={enabled}
      name={startIcon}
      clickHandler={() => actionHandler("start", eventId)}
    />
  );

  useEffect(() => {
    const positionContainer = anchor.current?.parentElement.parentElement;
    if (positionContainer) {
      positionContainer.style.zIndex = showPop ? "1" : "0";
    }
  }, [showPop]);

  useEffect(() => {
    // console.log("event mounted");
    return () => {
      // console.log("event dismounted");
    };
  }, []);

  return (
    <div
      ref={anchor}
      id={eventId}
      className={styles.EventWrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <EventContent
        participants={restProps.data?.participants}
        comment={comment}
        title={restProps.data?.title}
        owner={restProps.data?.owner}
        timeStart={timeStart}
        timeEnd={timeEnd}
        controls={Start}
        clickHandler={clickHandler}
        className={[
          showPop ? styles.EventPopped : styles.EventHidden,
          styles.EventPopup,
        ].join(" ")}
        // onMouseLeave={onMouseLeave}
      />

      <Appointments.Appointment
        {...restProps}
        className={clsx(styles.Event, styles[`Event${type}`], {
          [styles.EventSearchWrong]: search.length > 0 && !results,
          [styles.EventRunning]: enabled,
        })}
        onClick={eventClickHandler}
      >
        <>
          {type === "Month" ? (
            <div className={clsx(styles.EventHeader, styles.EventMonthHeader)}>
              <div className={styles.EventMonthTime}>{timeStart}</div>
              <div className={styles.EventMonthTitle}>
                {restProps.data?.title}
              </div>
              {Start}
            </div>
          ) : (
            <EventContent
              participants={restProps.data?.participants}
              comment={comment}
              title={restProps.data?.title}
              owner={restProps.data?.owner}
              controls={Start}
              timeStart={timeStart}
              timeEnd={timeEnd}
            />
          )}
        </>
      </Appointments.Appointment>
    </div>
  );
};
