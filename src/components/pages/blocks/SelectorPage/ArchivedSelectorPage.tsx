import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TouchEvents } from "@oktell/inputs";
import clsx from "clsx";
import { isMobile, isTablet } from "react-device-detect";

import { Expandable } from "components/common/UI/Expandable";

import { ExpandDivider } from "./MobileComponents/ExpandDivider";
import { MobileTabs } from "./MobileComponents/MobileTabs";
import { ParticipantsTab } from "./Tabs/Participants/Tab";
import { Visible } from "./Tabs/Visible";
import { TabButtons, TabPanel } from "./Tabs/Panel";
import { VotingTab } from "./Tabs/Voting/VotingNew";
import { NotesTab } from "./Tabs/Notes/NotesTab";
import { SelectorPlayer } from "./SelectorPlayer/SelectorPlayer";

import {
  ActionHandler,
  SelectorExtended,
  Tab,
  Voting as Voting,
} from "./types";
import { SelectorTabs } from "types/enums";
import { IBasicObject, TableEntities } from "types/index";

import { Tabs } from "./consts";
import { LSKeys } from "utils/consts";
import { getLocalDate } from "utils/dateConverters";
import { getBreakPoint } from "store/core/getters";

import styles from "./ArchivedSelectorPage.module.scss";

const tempFields = {
  timestartutc: "2022-07-05 06:19:50",
  user: "Селекторный К.В.",
};

interface Props {
  content: SelectorExtended;
  returnTitle?: string;
  actions?: TableEntities;
}

export const ArchivedSelectorPage: React.FC<Props> = ({
  content,
  returnTitle,
  actions,
}) => {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [users, setUsers] = useState(content?.participants);
  const [startDate, setStartDate] = useState(0);
  const [jumpTo, setJumpTo] = useState(0);
  const [expand, setExpand] = useState(true);

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["xl", "lg"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const selector = useMemo(() => ({ ...tempFields, ...content }), [content]);
  const start = useMemo(() => {
    return getLocalDate(selector.timestartutc, "yyyy-MM-dd HH:mm:ss");
  }, [selector]);

  const tabToggle = (tab: Tab | null = null) => {
    setActiveTab(tab);
  };

  const navigateTab = (direction: number) => {
    const current = tabs.findIndex((tab) => tab.key === activeTab.key);
    if (current > -1) {
      let newIndex = current + direction;
      if (newIndex < 0) newIndex = tabs.length - 1;
      if (newIndex > tabs.length - 1) newIndex = 0;
      setActiveTab(tabs[newIndex]);
    }
  };

  const showTab = (tab: Tab) => {
    const container = document.getElementById("tabs-slider");
    const index = tabs.findIndex((t) => t.key === tab?.key);
    const distance = container.offsetWidth * index;
    container.scrollTo({ behavior: "smooth", left: distance });
  };

  const restoreStartDate = () => {
    const start = localStorage.getItem(LSKeys.selector_start(selector?.id));
    const startDate = parseInt(start, 10);
    if (startDate) {
      setStartDate(startDate);
    }
  };

  const actionHandler = async (
    action: string,
    payload?: IBasicObject | IBasicObject[] | string
  ) => {
    const ACTION = actions?.[action];
    if (ACTION?.payloadMap && typeof payload === "object") {
      (payload as IBasicObject).entityId = selector?.id;
    }
  };

  const nonApiActionHandler: ActionHandler = async (
    action,
    payload: IBasicObject
  ) => {
    switch (action) {
      case "note-timestamp":
        const noteTimestamp = (payload.time as number) || 0;
        setJumpTo(noteTimestamp);
        setTimeout(() => {
          setJumpTo(0);
        }, 100);
        break;
      default:
        break;
    }
  };

  const countHands = useMemo(() => {
    if (users) {
      return users.filter((item) => item.is_hand_raised).length;
    }
    return 0;
  }, [users]);

  const tabs = useMemo(() => {
    return Tabs.map((tab) => {
      if (tab.key === SelectorTabs.voting && selector?.votings?.length)
        tab.count = selector.votings.length;
      else if (tab.key === SelectorTabs.handsup) {
        tab.count = countHands;
      }
      return tab;
    });
  }, [selector]);

  useEffect(() => {
    restoreStartDate();
    setActiveTab(Tabs[0]);
  }, []);

  useEffect(() => {
    if (selector?.participants) setUsers(selector.participants);
  }, [selector]);

  useEffect(() => {
    showTab(activeTab);
  }, [activeTab]);

  return (
    <>
      <div
        className={clsx(
          styles.Screen,
          styles.Readonly,
          styles[`Screen-${breakpoint}`],
          { [styles.ScreenMobile]: isTouchDevice },
          {
            [styles.ScreenExpanded]: !!activeTab,
          }
        )}
      >
        <div
          className={clsx(
            styles.Workzone,
            styles[`Workzone-${breakpoint}`],
            styles.Player
          )}
        >
          <Expandable state={expand}>
            <div>
              <SelectorPlayer
                selector={selector}
                jumpTo={jumpTo}
                users={users}
              />
            </div>
          </Expandable>
          {!isDesktop ? (
            <ExpandDivider show={expand} toggle={() => setExpand(!expand)} />
          ) : null}
          <div
            className={clsx(
              styles.LeftPanel,
              styles[`LeftPanel-${breakpoint}`],
              { [styles.LeftPanelMobile]: isTouchDevice },
              {
                [styles.Expanded]: !!activeTab,
              }
            )}
          >
            <div className={styles.LeftPanelControls}>
              {isDesktop ? (
                <TabButtons tabs={tabs} active={activeTab} toggle={tabToggle} />
              ) : (
                <MobileTabs tabs={tabs} active={activeTab} toggle={tabToggle} />
              )}
            </div>

            {isTouchDevice && breakpoint !== "xs" ? (
              <div className={styles.LeftPanelDots}>
                {tabs.map((tab) => (
                  <div
                    key={tab.key}
                    className={clsx(styles.LeftPanelDot, {
                      [styles.LeftPanelDotActive]: activeTab?.key === tab.key,
                    })}
                  ></div>
                ))}
              </div>
            ) : null}

            <div className={styles.LeftPanelContent}>
              <TouchEvents
                onSwipeLeft={() => navigateTab(1)}
                onSwipeRight={() => navigateTab(-1)}
              >
                <div id="tabs-slider" className={styles.SlideTabs}>
                  <Visible id={SelectorTabs.participants} show>
                    <ParticipantsTab
                      selectorId={selector?.id}
                      actionHandler={actionHandler}
                      users={users || []}
                      isVideo={selector?.is_video}
                    />
                  </Visible>
                  <Visible id={SelectorTabs.notes} show>
                    <NotesTab
                      readonly={true}
                      selectorID={selector?.id}
                      start={start as string}
                      actionHandler={nonApiActionHandler}
                    />
                  </Visible>

                  <Visible id={SelectorTabs.voting} show>
                    {content ? (
                      <VotingTab
                        controlled={selector?.enabled}
                        shadow
                        votings={(selector?.votings as Voting[]) || []}
                        users={users}
                        actionHandler={actionHandler}
                      />
                    ) : null}
                  </Visible>

                  <Visible id={SelectorTabs.handsup} show>
                    <ParticipantsTab
                      selectorId={selector?.id}
                      actionHandler={actionHandler}
                      users={users || []}
                      hands
                      isVideo={selector?.is_video}
                    />
                  </Visible>
                </div>
              </TouchEvents>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
