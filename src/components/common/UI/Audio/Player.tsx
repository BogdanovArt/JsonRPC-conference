import { makeStyles, Slider } from "@material-ui/core";
import { useState, useEffect, useRef, useCallback } from "react";

import { formatDuration } from "utils/formatDuration";

import styles from "./Player.modules.scss";

const styleOverrides = makeStyles({
  Slider: {
    "& .MuiSlider-rail": {
      height: 3,
      borderRadius: 2,
      backgroundColor: "var(--border-color)",
      opacity: 1,
    },    
    "& .MuiSlider-track": {
      color: "var(--accent-color)",
      height: 3,
      borderRadius: 2,
    },
    "& .MuiSlider-thumb": {
      color: "var(--bg-primary)",
      outline: "3px solid var(--accent-color)",
      border: "2px solid var(--accent-color)",
      boxShadow: "none !important",
      marginTop: -4.5,
      "&:after": {
        display: "none",
      }
    }
  },
});

interface Props {
  src: string;
  autoplay?: boolean;
}

export const Player = ({ src = "", autoplay }: Props) => {
  const classes = styleOverrides();

  const [source, setSource] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const streamCallback = useCallback((node) => {
    if (node) {
      setSource(node);
      if (autoplay) {
        setPlaying(true);
      }
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

  const stop = () => {
    source.pause();
    source.currentTime = 0;
  };

  const time = formatDuration(currentTime);
  const duration = formatDuration(maxTime);

  useEffect(() => {
    if (source) {
      source.addEventListener("timeupdate", onTimeChange);
      source.addEventListener("loadedmetadata", () =>
        setMaxTime(source.duration)
      );
    }
  }, [source]);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Bubble}>
        <div
          className={styles.SeekBar}
          onMouseDown={() => source?.pause()}
          onMouseUp={() => playing && source.play()}
        >
          <Slider
            value={currentTime}
            max={maxTime}
            className={classes.Slider}
            onChange={seek}
          />
        </div>
        <div className={styles.Controls}>
          <div className={styles.Controls}>
            {playing ? (
              <div className={styles.ControlsButton} onClick={pause}>
                <img src="svg/playerpause.svg" />
              </div>
            ) : (
              <div className={styles.ControlsButton} onClick={play}>
                <img src="svg/playerplay.svg" />
              </div>
            )}

            <div className={styles.ControlsButton} onClick={stop}>
              <img src="svg/playerstop.svg" />
            </div>
          </div>
          <div className={styles.Controls}>
            <div className={styles.Timer}>
              {time} ({duration})
            </div>
          </div>
        </div>
      </div>
      <audio ref={streamCallback} src={src} preload="auto" autoPlay={autoplay} />
    </div>
  );
};
