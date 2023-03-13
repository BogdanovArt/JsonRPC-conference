import { makeStyles, Popover } from "@material-ui/core";
import Slider from "@material-ui/core/Slider/Slider";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import { Icon } from "@oktell/icons";
import { Avatar } from "@oktell/header-panel";
import clsx from "clsx";
import { useState, useEffect, useRef, useCallback } from "react";

import { formatDuration } from "utils/formatDuration";
import { CallUser } from "../../types";
import { Speed, Timestamp } from "./types";

import isDate from "utils/isDate";
import { getDuration } from "utils/getDuration";

import styles from "./Player.module.scss";
import { isMobile, isTablet } from "react-device-detect";

const playbackSpeeds: Speed[] = [
  {
    value: 0.25,
  },
  {
    value: 0.5,
  },
  {
    title: "нормальная",
    value: 1,
  },
  {
    value: 1.25,
  },
  {
    value: 1.5,
  },
  {
    value: 1.75,
  },
  {
    value: 2,
  },
];

const styleOverrides = makeStyles({
  Slider: {
    "& .MuiSlider-rail": {
      height: 4,
      borderRadius: 0,
      backgroundColor: "var(--border-color)",
      opacity: 1,
    },
    "& .MuiSlider-track": {
      color: "var(--warning)",
      height: 4,
      borderRadius: 2,
    },
    "& .MuiSlider-thumb": {
      color: "var(--warning)",
      boxShadow: "none !important",
      marginTop: -4.5,
      zIndex: 3,
      "&:after": {
        display: "none",
      },
    },
  },
});

interface Props {
  src: string;
  users?: CallUser[];
  timestamps?: Timestamp[];
  start?: string;
  jumpTo?: number;
  mobile?: boolean;
}

const getSpeedTitle = (speed: Speed) => {
  if (speed.title) return speed.title;
  return speed.value.toLocaleString("ru-RU");
};

export const AudioPlayer: React.FC<Props> = ({
  src,
  start,
  users = [],
  timestamps = [],
  children,
  jumpTo = 0,
  mobile,
}) => {
  const classes = styleOverrides();

  const [source, setSource] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [showSpeeds, setShowSpeeds] = useState(false);

  const toggler = useRef<HTMLDivElement>(null);

  const isTouchDevice = isMobile || isTablet;

  const streamCallback = useCallback((node) => {
    if (node) {
      setSource(node);
    }
  }, []);

  const onTimeChange = () => {
    setCurrentTime(source.currentTime);
  };

  const play = () => {
    source.play();
    setPlaying(true);
  };

  const pause = () => {
    source.pause();
    setPlaying(false);
  };

  const seek = (e: unknown, time: number) => {
    source.currentTime = time;
  };

  const onTimestampClick = (time: number) => {
    seek(null, time);
  };

  const onSpeedClick = (value: number) => {
    setPlaySpeed(value);
    setShowSpeeds(false);
  };

  const stop = () => {
    source.pause();
    source.currentTime = 0;
  };

  const time = formatDuration(currentTime);
  const duration = formatDuration(maxTime);

  const jumpToTimestamp = (timestamp: number) => {
    const timeStart = new Date(start).getTime();
    const secondsPassed = getDuration(timeStart, timestamp) / 1000;

    source.currentTime = secondsPassed;

    // setCurrentTime(secondsPassed);
  };

  const renderTimeStamp = (ts: Timestamp, key: number) => {
    const startDate = start ? new Date(start) : new Date();
    const stampDate = new Date(ts.timestamp);

    if (!isDate(stampDate)) return null;

    const delta = stampDate.getTime() - startDate.getTime();
    const formatted = formatDuration(delta / 1000);
    const offset = ((delta / 1000 / maxTime) * 100).toFixed(2);

    return (
      <span
        key={key}
        className={styles.Timestamp}
        style={{ left: offset + "%" }}
        onClick={() => onTimestampClick(delta / 1000)}
      >
        <Tooltip
          enterDelay={400}
          arrow
          placement="top"
          title={`${ts.user} - ${formatted}`}
        >
          <div>
            <Avatar size={24} name={ts.user} />
          </div>
        </Tooltip>
        <span className={styles.TimestampTail}></span>
      </span>
    );
  };

  const renderPlayIcon = () => {
    return playing ? (
      <Icon
        name="pausecircle"
        className={clsx(styles.ControlsButton, "ButtonIcon")}
        onClick={pause}
      />
    ) : (
      <Icon
        name="play"
        className={clsx(styles.ControlsButton, "ButtonIcon")}
        onClick={play}
      />
    );
  };

  const renderControls = () => {
    return mobile || isTouchDevice ? (
      <>
        {renderPlayIcon()}
        <div className={clsx(styles.Timer, { [styles.TimerMobile]: mobile })}>
          <span>{time}</span> / {duration}
        </div>
        <div className={styles.Spacer}></div>
        {children}

        <div
          ref={toggler}
          className={styles.Speed}
          onClick={() => setShowSpeeds(true)}
        >
          <div>{playSpeed}x</div>
        </div>

        <Popover
          open={showSpeeds}
          anchorEl={toggler.current}
          container={toggler.current}
          PaperProps={{ className: styles.Pop }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={() => setShowSpeeds(false)}
        >
          <div className={clsx(styles.List, "PopUpList")}>
            <div className={styles.ListItemActive}>Скорость:</div>
            {playbackSpeeds.map((s, ind) => (
              <div
                key={s.value}
                className={clsx(styles.ListItem, "ListItem", {
                  [styles.ListItemActive]: s.value === playSpeed,
                })}
                onClick={() => onSpeedClick(s.value)}
              >
                {s.title || s.value + "x"}
              </div>
            ))}
          </div>
        </Popover>
      </>
    ) : (
      <>
        {renderPlayIcon()}
        <div className={clsx(styles.Timer, { [styles.TimerMobile]: mobile })}>
          <span>{time}</span> / {duration}
        </div>

        <div style={{ flex: 1 }} className={styles.ControlsSlot}>
          {children}
          <div className={styles.Speed}>
            <span>Скорость: </span>
            {playbackSpeeds.map((speed, index) => (
              <span
                key={index}
                className={clsx(styles.SpeedButton, {
                  [styles.SpeedButtonActive]: speed.value === playSpeed,
                })}
                onClick={() => setPlaySpeed(speed.value)}
              >
                {getSpeedTitle(speed)}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (source) {
      source.addEventListener("timeupdate", onTimeChange);
      source.addEventListener("loadedmetadata", () => {
        setMaxTime(source.duration);
        // setCurrentTime(69);
        // source.currentTime = 69;
      });
    }
  }, [source]);

  useEffect(() => {
    if (source) {
      source.playbackRate = playSpeed;
    }
  }, [playSpeed]);

  useEffect(() => {
    if (jumpTo) {
      jumpToTimestamp(jumpTo);
    }
  }, [jumpTo]);

  return (
    <div className={clsx(styles.Wrapper, { [styles.WrapperMobile]: mobile || isTouchDevice })}>
      <div className={clsx(styles.Bubble, { [styles.BubbleMobile]: mobile || isTouchDevice })}>
        <div
          className={styles.SeekBar}
          onMouseDown={() => source?.pause()}
          onMouseUp={() => playing && source.play()}
        >
          <div className={styles.Timestamps}>
            {timestamps.map((ts, index) => renderTimeStamp(ts, index))}
          </div>
          <Slider
            value={currentTime}
            max={maxTime}
            className={classes.Slider}
            onChange={seek}
          />
        </div>
        <div className={styles.Controls}>{renderControls()}</div>
      </div>
      <audio ref={streamCallback} src={src} preload="auto" />
    </div>
  );
};
