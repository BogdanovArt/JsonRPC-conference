import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@oktell/icons";
import { TouchEvents } from "@oktell/inputs";
import clsx from "clsx";

import { IconButton } from "components/common/UI/IconButton";

import { ParticipantsTab } from "./Tabs/Participants/Tab";
import { Visible } from "./Tabs/Visible";
import { Timer } from "./Timer";
import { TabButtons, TabPanel } from "./Tabs/Panel";
import { VotingTab } from "./Tabs/Voting/VotingNew";
import { NotesTab } from "./Tabs/Notes/NotesTab";
import { UsersGrid } from "./UsersGrid/UsersGrid";
import { SelectorPlayer } from "./SelectorPlayer/SelectorPlayer";

import {
  ActionHandler,
  SelectorExtended,
  Tab,
  Voting as Voting,
} from "./types";
import { SelectorTabs } from "types/enums";
import { IBasicObject, TableEntities } from "types/index";

import { CurrentSelectorTabs, Tabs } from "./consts";
import { LSKeys } from "utils/consts";
import { actionCreator } from "./utils";

import { AppDispatch } from "store/index";
import { requestContentData } from "store/content/actions";

import styles from "./SelectorPage.module.scss";
import { getLocalDate } from "utils/dateConverters";
import { UserMenu } from "components/pages/blocks/SelectorPage/UserMenu/UserMenu";
import { SelectorViewBar } from "components/pages/blocks/CalendarPage/blocks/SelectorViewBar";
import { ModalClose } from "components/pages/blocks/SelectorPage/Modal/ModalClose";
import { getBreakPoint } from "store/core/getters";
import { PopUpMenu, Portal } from "@oktell/header-panel";
import { CreateVotingModal } from "components/pages/blocks/SelectorPage/Tabs/Voting/CreateVotingModal";
import { AddParticipant } from "components/pages/blocks/SelectorPage/Tabs/Participants/AddParticipant";
import { isMobile, isTablet } from "react-device-detect";

const tempFields = {
  timestartutc: "2022-07-05 06:19:50",
  user: "Селекторный К.В.",
};

interface Props {
  content: SelectorExtended;
  returnTitle?: string;
  actions?: TableEntities;
}

export const SelectorPage: React.FC<Props> = ({
  content,
  returnTitle,
  actions,
}) => {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [users, setUsers] = useState(content?.participants);
  const [startDate, setStartDate] = useState(0);
  const [jumpTo, setJumpTo] = useState(0);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openVotingMobile, setOpenVotingMobile] = useState(false);
  const [openParticipantMobile, setOpenParticipantMobile] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const selector = useMemo(() => ({ ...tempFields, ...content }), [content]);
  const start = useMemo(() => {
    return getLocalDate(selector.timestartutc, "yyyy-MM-dd HH:mm:ss");
  }, [selector]);

  const goBack = () => {
    actions?.back && dispatch(requestContentData(actions?.back));
  };

  const openMenu = () => {
    setOpenMobileMenu(true);
  };

  const closeMenu = () => {
    setOpenMobileMenu(false);
  };

  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };
  const selectorSubmenu = {
    participant: "Добавить участника",
    voting: "Создать опрос",
    close: "Завершить селектор",
  };

  const selectorSubmenuHandler = (key: string) => {
    switch (key) {
      case "voting":
        setOpenVotingMobile(true);
        break;
      case "participant":
        setOpenParticipantMobile(true);
        break;
      case "close": {
        toggleCloseModal();
        break;
      }
      default:
        break;
    }
  };

  const tabToggle = (tab: Tab | null = null) => {
    tab.key === activeTab?.key ? setActiveTab(null) : setActiveTab(tab);
  };

  const stopSelector = async () => {
    await actionHandler("stop", selector?.id);
    localStorage.removeItem(LSKeys.selector_start(selector?.id));
    actions?.back && dispatch(requestContentData(actions.back));
    // setStartDate(0);
    // localStorage.removeItem(selector?.id);
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
    // return;

    if (ACTION?.payloadMap && typeof payload === "object") {
      // console.log("payload condition");
      (payload as IBasicObject).entityId = selector?.id;
    }

    // console.warn(ACTION, action, payload, typeof payload);

    if (ACTION) {
      const actionPayload = actionCreator({ action: ACTION, payload });
      await dispatch(requestContentData(actionPayload));
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

  const navigateTab = (direction: number) => {
    const current = tabs.findIndex((tab) => tab.key === activeTab.key);
    if (current > -1) {
      let newIndex = current + direction;
      if (newIndex < 0) newIndex = tabs.length - 1;
      if (newIndex > tabs.length - 1) newIndex = 0;
      setActiveTab(tabs[newIndex]);
      setShowControlPanel(false);
    }
  };

  const showTab = (tab: Tab) => {
    const container = document.getElementById("tabs-slider");
    const index = tabs.findIndex((t) => t.key === tab?.key);
    const distance = container.offsetWidth * index;
    container.scrollTo({ behavior: "smooth", left: distance });
  };

  const renderStatusInfo = (name?: string, startDate?: number) => {
    return (
      <div
        className={clsx(styles.StatusInfo, styles[`StatusInfo-${breakpoint}`])}
      >
        <span
          className={clsx(
            styles.StatusName,
            styles[`StatusName-${breakpoint}`]
          )}
        >
          {name}
        </span>

        {startDate ? (
          <>
            <span
              className={clsx(
                styles.StatusIcon,
                styles[`StatusIcon-${breakpoint}`]
              )}
            >
              <Icon name="record" />
            </span>
            <div className={clsx(styles[`StatusTimer-${breakpoint}`])}>
              <Timer startDate={startDate} />
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const renderStatus = () => {
    return (
      <div
        className={clsx(styles.Status, styles[`Status-${breakpoint}`], {
          [styles.StatusTabs]:
            !isDesktop && activeTab && activeTab.key !== SelectorTabs.selector,
        })}
      >
        {isDesktop ? (
          <span>
            <Icon
              name="chevron"
              style={{ transform: "rotate(-90deg)", cursor: "pointer" }}
              onClick={() => goBack()}
            />
          </span>
        ) : null}

        {!isDesktop && activeTab && activeTab.key !== SelectorTabs.selector
          ? renderStatusInfo(activeTab.title)
          : renderStatusInfo(selector.displayname, startDate)}
      </div>
    );
  };

  const renderTabPanel = () => {
    return (
      <div className={clsx(styles.TopPanel, styles[`TopPanel-${breakpoint}`])}>
        <TabPanel
          submenu={selectorSubmenu}
          submenuHandler={selectorSubmenuHandler}
          status={renderStatus()}
        >
          {isDesktop ? (
            <TabButtons tabs={tabs} active={activeTab} toggle={tabToggle} />
          ) : (
            <PopUpMenu
              mobile={!isDesktop}
              activator={
                <div>
                  <Icon name="burger" />
                </div>
              }
              mobileHeader={
                <div className={styles.MenuHeader}>
                  <div
                    className={styles.MenuHeaderIcon}
                    onClick={() => closeMenu()}
                  >
                    <Icon name={"close"} />
                  </div>
                  <div className={styles.MenuHeaderText}>
                    {selector.displayname}
                  </div>
                </div>
              }
              content={
                <div className={styles.MenuContent}>
                  <TabButtons
                    tabs={tabs}
                    active={activeTab}
                    toggle={tabToggle}
                  />
                </div>
              }
              open={openMobileMenu}
              onClose={closeMenu}
              onOpen={openMenu}
            />
          )}
        </TabPanel>
      </div>
    );
  };

  const countHands = useMemo(() => {
    if (users) {
      return users.filter((item) => item.is_hand_raised).length;
    }

    return 0;
  }, [users]);

  const tabs = useMemo(() => {
    const source = isDesktop ? Tabs : CurrentSelectorTabs;
    return source.map((tab) => {
      if (tab.key === SelectorTabs.voting && selector?.votings?.length)
        tab.count = selector.votings.length;
      else if (tab.key === SelectorTabs.handsup) {
        tab.count = countHands;
      } else if (tab.key === SelectorTabs.selector) {
        tab.timer = startDate;
      }
      return tab;
    });
  }, [selector, startDate, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setActiveTab(tabs[0]);
    } else {
      setActiveTab(null);
    }
  }, [isDesktop]);

  useEffect(() => {
    showTab(activeTab);
  }, [activeTab]);

  const toggleCloseModal = () => {
    setShowCloseModal(!showCloseModal);
  };

  useEffect(() => {
    restoreStartDate();
  }, []);

  useEffect(() => {
    if (selector?.participants) setUsers(selector.participants);
  }, [selector]);

  useEffect(() => {
    closeMenu();
  }, [activeTab]);

  return (
    <>
      <div
        className={clsx(styles.Screen, styles[`Screen-${breakpoint}`], {
          [styles.ScreenExpanded]: !!activeTab,
        })}
      >
        {renderTabPanel()}

        <div className={clsx(styles.Workzone)}>
          {!isDesktop ? null : (
            <div className={styles.UsersWrap}>
              <UsersGrid
                isVideo={selector?.is_video}
                videoMode={selector?.video_mode}
                users={users}
                actionHandler={actionHandler}
                selectorId={selector?.id}
              />
            </div>
          )}
          <div
            className={clsx(
              styles.LeftPanel,
              styles[`LeftPanel-${breakpoint}`],
              {
                [styles.Expanded]: !!activeTab || !isDesktop,
                [styles.ExpandedTablet]: isTouchDevice && activeTab,
              }
            )}
          >
            <div
              className={clsx(
                styles.LeftPanelContent,
                styles[`LeftPanelContent-${breakpoint}`],
                { [styles.LeftPanelContentTablet]: isTouchDevice }
              )}
            >
              {isTouchDevice ? (
                <div className={styles.TabsIndicator}>
                  {tabs.map((item) => (
                    <div
                      className={clsx(styles.TabsIndicatorItem, {
                        [styles.TabsIndicatorItemActive]:
                          item?.key === activeTab?.key ||
                          (item.key === "selector" && !activeTab),
                      })}
                    ></div>
                  ))}
                </div>
              ) : null}
              <TouchEvents
                onSwipeLeft={() => navigateTab(1)}
                onSwipeRight={() => navigateTab(-1)}
              >
                <div
                  id="tabs-slider"
                  className={clsx(styles[`SlideTabs-${breakpoint}`], {
                    [styles.SlideTabsTablet]: isTouchDevice,
                  })}
                >
                  <Visible
                    show={
                      activeTab?.key === SelectorTabs.selector || !isDesktop
                    }
                    className={clsx({
                      [styles.TabHide]: isTouchDevice && isDesktop,
                    })}
                  >
                    <div
                      className={clsx(styles.UsersWrap, styles.UsersWrapTabs)}
                    >
                      <UsersGrid
                        isVideo={selector?.is_video}
                        videoMode={selector?.video_mode}
                        users={users}
                        actionHandler={actionHandler}
                        selectorId={selector?.id}
                        showControlPanel={toggleControlPanel}
                      />
                    </div>
                  </Visible>
                  <Visible
                    show={
                      activeTab?.key === SelectorTabs.participants || !isDesktop
                    }
                  >
                    <ParticipantsTab
                      selectorId={selector?.id}
                      actionHandler={actionHandler}
                      users={users || []}
                      isVideo={selector?.is_video}
                    />
                  </Visible>
                  <Visible
                    show={activeTab?.key === SelectorTabs.notes || !isDesktop}
                  >
                    <NotesTab
                      selectorID={selector?.id}
                      start={start as string}
                      actionHandler={nonApiActionHandler}
                    />
                  </Visible>

                  <Visible
                    show={activeTab?.key === SelectorTabs.voting || !isDesktop}
                  >
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

                  <Visible
                    show={activeTab?.key === SelectorTabs.handsup || !isDesktop}
                  >
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
        <div
          className={clsx(styles.Controls, styles[`Controls-${breakpoint}`], {
            [styles.HidePanel]: !isDesktop && !showControlPanel,
          })}
        >
          <IconButton
            disabled
            icon="nomic"
            color="var(--accent-color)"
            className={clsx(styles[`IconButton-${breakpoint}`])}
          >
            Выключить всем микрофон
          </IconButton>
          <IconButton
            dark
            icon="closecircle"
            color="var(--warning)"
            onClick={() => toggleCloseModal()}
          >
            Завершить селектор
          </IconButton>

          {selector?.is_video ? (
            <UserMenu
              compact
              anchor={
                <IconButton icon={"cogwheel"}>Выбрать представление</IconButton>
              }
            >
              <SelectorViewBar
                vertical
                initial={selector?.video_mode}
                selectorId={selector?.id}
                usersCount={users.length}
                actionHandler={actionHandler}
              />
            </UserMenu>
          ) : (
            <IconButton icon={"cogwheel"} disabled>
              Выбрать представление
            </IconButton>
          )}
        </div>

        {showCloseModal ? (
          <ModalClose exit={stopSelector} onClose={toggleCloseModal} />
        ) : null}

        {!isDesktop && openVotingMobile ? (
          <CreateVotingModal
            shadow
            show={openVotingMobile}
            toggle={setOpenVotingMobile}
            actionHandler={actionHandler}
            removeHandler={() => null}
          />
        ) : null}

        {!isDesktop && openParticipantMobile ? (
          <AddParticipant
            onAdd={actionHandler}
            onClose={() => setOpenParticipantMobile(false)}
            hideAddButton
            showModal={openParticipantMobile}
          />
        ) : null}
      </div>
    </>
  );
};
