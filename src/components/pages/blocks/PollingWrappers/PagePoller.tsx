import { isDev } from "@oktell/utils";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { requestContentData } from "store/content/actions";

import { GenericAction } from "store/content/types";
import { IBasicObject } from "types/index";

import { pollingMessage } from "utils/consts";

interface Props {
  fq?: number;
  action?: GenericAction;
  payload?: IBasicObject;
  children: JSX.Element | JSX.Element[];
}

export const PagePoller = ({ children, fq, action, payload }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let requestCancelSource: any = null;
    let delayedRequestTimer: ReturnType<typeof setInterval> = null;

    const createPollingRequest = () => {
      requestCancelSource = axios.CancelToken.source();
      delayedRequestTimer = setTimeout(async () => {
        const newAction = {
          ...action,
          polling: true,
          cancelToken: requestCancelSource?.token,
        };
        if (payload) newAction.options = payload;
        // console.log("polling");
        await dispatch(requestContentData(newAction));
        fq && action && delayedRequestTimer && createPollingRequest();
      }, fq * 1000);
    };
    const cancelPollingRequest = () => {
      requestCancelSource && requestCancelSource.cancel(pollingMessage);
      clearTimeout(delayedRequestTimer);
      requestCancelSource = null;
      delayedRequestTimer = null;
    };

    // console.log("%c mount poling", "color: green", fq, action);
    !isDev() && fq && action && createPollingRequest();
    return () => {
      // console.log("%c unmount polling", "color: red");
      cancelPollingRequest();
    };
  }, [action, fq]);

  const manualPoll = async () => {
    const newAction = {
      ...action,
      polling: true,
    };
    if (payload) newAction.options = payload;
    await dispatch(requestContentData(newAction));
  };

  return (
    <>
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 20,
          left: 20,
          background: "green",
          zIndex: 9999,
          padding: 20,
        }}
      >
        <button onClick={manualPoll}>POLL BUTTON</button>
      </div>
      {children}
    </>
  );
};
