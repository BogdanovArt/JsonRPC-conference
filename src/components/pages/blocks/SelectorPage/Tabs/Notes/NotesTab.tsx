import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";
import { isMobile, isTablet } from "react-device-detect";
import clsx from "clsx";

import { NoteBlock } from "./NoteBlock";

import { getTimeFromDate } from "utils/getTimeFromDate";
import { getDuration } from "utils/getDuration";
import { formatDuration } from "utils/formatDuration";
import { ActionHandler, Note } from "../../types";
import { copy } from "utils/copy";
import { LSKeys } from "utils/consts";

import styles from "./NotesTab.module.scss";

interface Props {
  start?: string;
  readonly?: boolean;
  selectorID: string;
  initial?: unknown;
  actionHandler?: ActionHandler;
}

export const NotesTab: React.FC<Props> = ({
  start,
  selectorID,
  initial,
  readonly,
  actionHandler = () => null,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [active, setActive] = useState<number>(2);
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const createNode = (index: number = notes.length) => {
    const notesCopy = copy(notes);
    const id = Date.now();
    notesCopy.splice(index, 0, {
      id,
      time: 0,
      text: "",
    });
    setActive(id);
    setNotes(notesCopy);
    saveData(notesCopy);
  };

  const returnValue = (index: number, value: string) => {
    const notesCopy = copy(notes);
    const note = notesCopy[index];
    if (!note.time) note.time = Date.now();
    note.text = value;
    setNotes(notesCopy);
    saveData(notesCopy);
  };

  const removeNote = (index: number) => {
    const notesCopy = copy(notes);
    if (notesCopy.length > 1) {
      notesCopy.splice(index, 1);
      setNotes(notesCopy);
      saveData(notesCopy);
    }
  };

  const restoreData = () => {
    const restoredNotes = localStorage.getItem(
      LSKeys.selector_notes(selectorID)
    );
    const parsedNotes = JSON.parse(restoredNotes);
    // console.warn(parsedNotes, restoredNotes);
    if (parsedNotes?.length) {
      setNotes(JSON.parse(restoredNotes));
    } else {
      createNode(0);
    }
  };

  const saveData = (data: Note[]) => {
    localStorage.setItem(
      LSKeys.selector_notes(selectorID),
      JSON.stringify(data)
    );
  };

  const jumpToSelectorTime = (time: number) => {
    actionHandler("note-timestamp", { time });
  };

  const getFormattedTimeStamp = (timestamp: number) => {
    if (!start) return;
    const timeStart = new Date(start).getTime();
    const secondsPassed = getDuration(timeStart, timestamp) / 1000;
    return formatDuration(secondsPassed);
  };

  useEffect(() => {
    if (selectorID) restoreData();
  }, [selectorID]);

  return (
    <div className={styles.Wrapper}>
      {isDesktop && !isTouchDevice ? (
        <div className={clsx(styles.Header, "TabHeader")}>Заметки</div>
      ) : null}

      <div
        className={clsx(styles.Content, styles[`Content-${breakpoint}`], {
          [styles.ContentTablet]: isTouchDevice,
        })}
      >
        <ScrollContainer>
          <div className={styles.Grid}>
            <div
              className={styles.RowPseudo}
              onClick={() => (readonly ? null : createNode(0))}
            />
            {notes.map((note, index) => [
              <div key={`${note.id}-id`} className={styles.Row}>
                <div
                  className={styles.TimeStamp}
                  onClick={() => jumpToSelectorTime(note.time)}
                >
                  {note.time ? getFormattedTimeStamp(note.time) : null}
                </div>
                <NoteBlock
                  readonly={readonly}
                  active={active === note.id}
                  note={note}
                  onRemove={() => removeNote(index)}
                  returnValue={(v) => returnValue(index, v)}
                  actionHandler={actionHandler}
                  className={styles.Note}
                />
              </div>,
              <div
                key={`${index}-pseudo`}
                className={styles.RowPseudo}
                onClick={() => (readonly ? null : createNode(index + 1))}
              />,
            ])}
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
};
