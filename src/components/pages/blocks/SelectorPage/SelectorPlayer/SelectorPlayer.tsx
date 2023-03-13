import { useCallback, useEffect, useState, useMemo } from "react";
import { isDev } from "@oktell/utils";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import { useSelector } from "react-redux";

import { ScrollContainer } from "components/common/UI/ScrollContainer";

import { AudioPlayer } from "./blocks/Player";
import { Greeting, TimeInfo } from "./blocks/Greeting";
import { UsersGrid } from "../UsersGrid/UsersGrid";
import { MobileDescription } from "./blocks/MobileDescription";

import { CallUser, SelectorExtended } from "../types";
import { Timestamp } from "./blocks/types";
import { getLocalDate } from "utils/dateConverters";

import { getBreakPoint } from "store/core/getters";

import styles from "./SelectorPlayer.module.scss";
import playerStyles from "./blocks/Player.module.scss";
import { isTablet } from "react-device-detect";

// --- temp ---

const timestamps: Timestamp[] = [
  {
    timestamp: "2022-05-31 14:44:15",
    user: "244",
  },
  {
    timestamp: "2022-05-31 14:44:34",
    user: "122",
  },
  {
    timestamp: "2022-05-31 14:44:38",
    user: "534",
  },
  {
    timestamp: "test-fail",
    user: "noname",
  },
];

// --- temp ---

interface Props {
  selector?: SelectorExtended;
  users?: CallUser[];
  jumpTo: number;
}

let timer: NodeJS.Timer = null;

export const SelectorPlayer: React.FC<Props> = ({
  children,
  selector,
  jumpTo,
  users = [],
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [showGreetingScreen, setShowGreetingScreen] = useState(true);

  const [expandInfo, setExpandInfo] = useState(false);

  const breakpoint = useSelector(getBreakPoint);
  const isMobile = ["xs", "md"].includes(breakpoint);

  const start = useMemo(() => {
    return getLocalDate(selector.timestartutc, "yyyy-MM-dd HH:mm:ss");
  }, [selector]);

  const onFullscreen = useCallback(() => {
    setFullscreen(true);
    document.addEventListener("keydown", keyPressHandler);
  }, []);

  const onExitFullscreen = useCallback(() => {
    setFullscreen(false);
    document.removeEventListener("keydown", keyPressHandler);
  }, []);

  const keyPressHandler = useCallback((e) => {
    if (e.key === "Escape") setFullscreen(false);
  }, []);

  useEffect(() => {
    if (isDev()) setShowGreetingScreen(false);
    timer = setTimeout(() => {
      setShowGreetingScreen(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={clsx(styles.Wrapper, styles[`Wrapper-${breakpoint}`])}>
      <Greeting selector={selector} show={showGreetingScreen} />
      <div
        className={clsx(styles.Screen, styles[`Screen-${breakpoint}`], {
          [styles.Fullscreen]: fullscreen,
          [styles.ScreenMobile]: isTablet,
        })}
      >
        <UsersGrid users={users} />
        <AudioPlayer
          src="https://actions.google.com/sounds/v1/ambiences/jungle_atmosphere_morning.ogg"
          start={start as string}
          mobile={isMobile}
          timestamps={timestamps}
          jumpTo={jumpTo}
        >
          {!isMobile ? <div>Участники ({users?.length})</div> : null}
          {fullscreen ? (
            <Icon
              name="exitfullscreen"
              onClick={() => onExitFullscreen()}
              style={{ order: 1 }}
              className={clsx(playerStyles.ControlsButton, "ButtonIconAccent")}
            />
          ) : (
            <Icon
              name="fullscreen"
              onClick={() => onFullscreen()}
              style={{ order: 1 }}
              className={clsx(playerStyles.ControlsButton, "ButtonIconAccent")}
            />
          )}
        </AudioPlayer>
      </div>
      <ScrollContainer className={styles.Info}>
        {isMobile ? (
          <button
            onClick={() => setExpandInfo(!expandInfo)}
            className={styles.SelectorExpand}
          >
            <Icon name={expandInfo ? "close" : "chevron"} />
          </button>
        ) : null}

        <MobileDescription
          selector={selector}
          mobile={isMobile}
          expanded={expandInfo}
        />
        <TimeInfo
          start={start as string}
          durationSec={281}
          style={{ fontSize: 18 }}
          className={styles.TimeStamp}
        />
      </ScrollContainer>
    </div>
  );
};
