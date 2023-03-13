import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { NodeViewWrapper } from "@tiptap/react";
import { Backdrop, makeStyles, Popover } from "@material-ui/core";

import { Player } from "components/common/UI/Audio/Player";

import isDate from "utils/isDate";
import { formatDuration } from "utils/formatDuration";
import apiRequest, { requestUrl } from "utils/apiRequest";

import { requestContentData } from "store/content/actions";

import { ActionTypes, ButtonEntities, RequestMethods } from "types/enums";

import styles from "./RecordBlock.module.scss";

const styleOverrides = makeStyles({
  Pop: {
    "& .MuiPaper-root": {
      background: "transparent",
      boxShadow: "none",
    },
  },
});

export interface RecordProps {
  id?: string;
  timeStart?: string;
  timeEnd?: string;
  recordId?: string;
  savedId?: number;
}

// @TODO create indexedDB saving logic

export const RecordBlock = ({ node, updateAttributes }: any) => {
  const { id, timeStart, timeEnd, recordId, savedId } =
    node?.attrs as RecordProps;

  const classes = styleOverrides();
  const dispatch = useDispatch();

  // const { add, getByID } = useIndexedDB(DBRecords);

  const [anchor, setAnchor] = useState(null);
  const [link, setLink] = useState("");
  const [duration, setDuration] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);

  const dateStart = parseISO(timeStart);
  const dateEnd = parseISO(timeEnd);

  const refCallback = useCallback((node) => {
    if (node) {
      setAnchor(node);
    }
  }, []);

  const getTime = (date: Date) => {
    if (!isDate(date)) {
      return "";
    }
    return format(date, "HH:mm");
  };

  const stopRecording = async () => {
    const stopRecordRequest = {
      entity: ButtonEntities.SELECTOR_REMOVE_PARTICIPANT,
      action: ActionTypes.delete,
      options: {
        selector_id: id,
        participant_id: recordId,
      },
    };

    await dispatch(requestContentData(stopRecordRequest));

    const downloadRequest = {
      entity: ButtonEntities.DOWNLOAD,
      options: { id },
    };

    const res = await apiRequest({
      data: downloadRequest,
      method: RequestMethods.POST,
      url: requestUrl,
      type: "blob",
    });

    if ((res.status === 200 || res.status === 201) && res?.data) {
      setBlob(res.data);

      const endDate = new Date();
      const formatted = format(endDate, "yyyy-MM-dd HH:mm:ss");
      updateAttributes({
        timeEnd: formatted,
      });

      saveRecording(res.data as Blob);
    }
  };

  const openPlayer = async () => {
    if (blob) {
      setLink(URL.createObjectURL(blob));
    }
  };

  const closePlayer = () => {
    setLink("");
  };

  const saveRecording = async (data: Blob) => {
    const blobSecret = `${timeStart}-${timeEnd}`;
    const blobId = window.btoa(blobSecret);
    // add({ record_id: blobId, record_content: data }).then(
    //   (index: number) => {
    //     // console.log("succesfully saved", index);
    //     updateAttributes({
    //       savedId: index,
    //     });
    //   },
    //   (error: unknown) => {
    //     console.warn("error saving recording", error);
    //   }
    // );
  };

  const restoreRecording = (id: number) => {
    // getByID(id).then(
    //   (entity) => {
    //     // console.log("restore success");
    //     setBlob(entity.record_content);
    //   },
    //   (error) => {
    //     console.warn("error restoring DB record", error);
    //   }
    // );
  };

  const getDuration = (start: Date, end: Date, seconds = true) => {
    let distance = 0;
    if (isDate(end)) {
      distance = end.getTime() - start.getTime();
    } else {
      distance = Date.now() - start.getTime();
    }
    return formatDuration(distance / 1000, seconds);
  };

  const start = getTime(dateStart);
  const end = getTime(dateEnd);

  useEffect(() => {
    let counter: NodeJS.Timer = null;
    if (!end && !counter) {
      counter = setInterval(() => {
        setDuration(getDuration(dateStart, dateEnd));
      }, 1000);
    } else {
      clearInterval(counter);
      setDuration(getDuration(dateStart, dateEnd, false));
    }
    return () => {
      clearInterval(counter);
    };
  }, [end]);

  useEffect(() => {
    // console.log(savedId, "mounted");
    if (savedId) {
      restoreRecording(savedId);
    }
    return () => {
      // console.log(savedId, "unmounted");
    };
  }, []);

  return (
    <NodeViewWrapper className="record-component">
      <div ref={refCallback} className={styles.Wrapper}>
        {!end ? <img src="svg/recording.svg" /> : <span>Запись: </span>}
        <div className={styles.Time}>
          {start && start.slice(0, 5)} - {end ? end.slice(0, 5) : "..."}
          {duration && `(${duration})`}
        </div>
        {!end ? (
          <div
            className={styles.Button}
            title="Остановить запись"
            onClick={stopRecording}
          >
            <img src="svg/playerstop.svg" />
          </div>
        ) : (
          <div
            className={styles.Button}
            title="Воспроизвести запись"
            onClick={openPlayer}
          >
            <img src="svg/play.svg" />
          </div>
        )}
        {anchor && (
          <>
            <Backdrop
              style={{ zIndex: 100, backgroundColor: "rgba(0,0,0,0.18)" }}
              open={!!link}
            >
              <Popover
                open={!!link}
                anchorEl={anchor}
                container={anchor}
                onClose={closePlayer}
                className={classes.Pop}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <div className={styles.PlayerWrapper}>
                  <Player src={link} autoplay />
                </div>
              </Popover>
            </Backdrop>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};
