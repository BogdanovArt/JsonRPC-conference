import React, {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";
import { Icon } from "@oktell/icons";
import { isMobile, isTablet } from "react-device-detect";
import { TextareaAutosize } from "@material-ui/core";
import clsx from "clsx";

import { ActionHandler, Note } from "../../types";

import styles from "./NoteBlock.module.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  note: Note;
  readonly?: boolean;
  actionHandler?: ActionHandler;
  onRemove?: () => void;
  returnValue?: (value: string) => void;
}

export const NoteBlock: React.FC<Props> = ({
  active,
  note,
  readonly,
  onRemove = () => null,
  returnValue = () => null,
  actionHandler = () => null,
  className,
  ...rest
}) => {
  const [value, setValue] = useState(note.text);
  const [interactive, setInteractive] = useState(!note.text);
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const input = useRef<HTMLTextAreaElement>(null);

  const showInput = !readonly && interactive;

  const inputHandler: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
    returnValue(e.target.value);
  };

  const clickHandler = () => {
    setInteractive(true);
    if (readonly) jumpToSelectorTime();
    setTimeout(() => {
      setFocus();
    }, 0);
  };

  const jumpToSelectorTime = () => {
    const pl = { time: note.time };
    actionHandler("note-timestamp", pl);
  };

  const blurHandler = () => {
    // if (!value) return;
    if (value) {
      setInteractive(false);
      returnValue(value);
    } else {
      onRemove();
    }
  };

  const setFocus = () => {
    input.current?.focus();
  };

  const focusHandler: FocusEventHandler = (e) => {
    input.current?.setSelectionRange(value.length, value.length);
  };

  useEffect(() => {
    // if (interactive) setFocus();
  }, [interactive]);

  useEffect(() => {
    if (active && isDesktop) setFocus();
  }, []);

  return (
    <div className={clsx(styles.Wrapper, className)} {...rest}>
      {showInput ? (
        <div
          className={clsx(
            styles.TextAreaWrap,
            styles[`TextAreaWrap-${breakpoint}`],
            { [styles.TextAreaWrapTablet]: isTouchDevice }
          )}
        >
          <TextareaAutosize
            ref={input}
            value={value}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onInput={inputHandler}
            className={styles.TextInteractive}
          />
          {!isDesktop || isTouchDevice ? (
            <div className={styles.Send} onClick={() => blurHandler()}>
              <Icon name="send" />
            </div>
          ) : null}
        </div>
      ) : (
        <div onClick={clickHandler} className={styles.TextReadonly}>
          {value}
        </div>
      )}
    </div>
  );
};
