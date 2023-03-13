import React from "react";
import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { Timer } from "components/pages/blocks/SelectorPage/Timer";
import { PopUpList } from "components/common/UI/PopUpList";
import { MobileModalHeader } from "components/pages/blocks/CalendarPage/blocks/MobileHeader";

import { Tab } from "../types";
import { BreakPoints, SelectorTabs } from "types/enums";

import { getBreakPoint } from "store/core/getters";

import styles from "./Panel.module.scss";

interface TabProps {
  tabs: Tab[];
  toggle?: (tab: Tab) => void;
  active?: Tab;
}

export const TabButtons: React.FC<TabProps> = ({
  tabs,
  toggle,
  active,
  children,
}) => {
  const breakpoint = useSelector(getBreakPoint);
  // const isDesktop = ["lg", "xl"].includes(breakpoint);

  // const filterTabs = tabs.filter((item) => {
  //   return item.key !== SelectorTabs.selector || !isDesktop;
  // });

  return (
    <>
      {tabs.map((el) => (
        <TabButton
          key={el.key}
          tab={el}
          active={active?.key === el.key}
          toggle={toggle}
          breakpoint={breakpoint}
        >
          {children}
        </TabButton>
      ))}
    </>
  );
};

export const TabButton: React.FC<{
  tab: Tab;
  active?: boolean;
  toggle?: (tab: Tab) => void;
  breakpoint: BreakPoints;
}> = ({ tab, active, children, breakpoint, toggle = () => null }) => {
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  return (
    <div
      className={clsx(styles.Button, styles[`Button-${breakpoint}`], {
        [styles.ButtonActive]: active,
        [styles.ButtonDisabled]: tab.disabled,
      })}
      onClick={() => toggle(tab)}
    >
      <div className={styles.IconWrapper}>
        <Icon name={tab.icon} className="button-icon" />
        {tab.count && isDesktop ? (
          <div
            className={clsx(
              styles.Notification,
              styles.NotificationCount,
              tab.key
            )}
          >
            <span>{tab.count}</span>
          </div>
        ) : null}
        {children}
      </div>
      <div>{tab.title}</div>
      {tab.count && !isDesktop ? (
        <div
          className={clsx(
            styles.Notification,
            styles.NotificationCount,
            styles[`Notification-${breakpoint}`],
            tab.key
          )}
        >
          <span>{tab.count}</span>
        </div>
      ) : null}
      {children}
      {!isDesktop && tab.timer ? (
        <div className={styles.Timer}>
          <Timer startDate={tab.timer} />
          <Icon className={styles.TimerIcon} name={"record"} />
        </div>
      ) : null}
    </div>
  );
};

interface Props {
  status?: JSX.Element | JSX.Element[];
  submenu?: any;
  submenuHandler?: (key: string) => void;
}

export const TabPanel: React.FC<Props> = ({
  status,
  submenu,
  submenuHandler,
  children,
}) => {
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);

  return (
    <>
      {isDesktop ? (
        <div className={clsx(styles.Panel, styles[`Panel-${breakpoint}`])}>
          <div>{status}</div>
          <div
            className={clsx(
              styles.PanelControls,
              styles[`PanelControls-${breakpoint}`]
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <MobileModalHeader
          className={styles.MobileHeader}
          leftIcon={null}
          leftSlot={children as JSX.Element}
          rightSlot={
            <PopUpList items={submenu} onClick={submenuHandler}>
              <Icon name="menudots" className={styles.ModalActionsIcon} />
            </PopUpList>
          }
        >
          <div>{status}</div>
        </MobileModalHeader>
      )}
    </>
  );
};
