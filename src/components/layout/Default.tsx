import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PanelWrapper, PopUpMenu } from "@oktell/header-panel";
import { MobileHeader } from "@oktell/header-panel/lib/blocks/MobileHeader";
import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { isMobile, isTablet } from "react-device-detect";

import { ThemeSwitch } from "components/menu/ThemeSwitch";
import { MenuLeft } from "components/menu/MenuLeft";

import { getCurrentAction } from "store/content/getters";
import { setBreakPoint } from "store/core";
import { requestContentData } from "store/content/actions";

import { LayoutProps } from "./types";
import { getBreakPoint } from "store/core/getters";

import styles from "./Default.module.scss";

interface MenuProps {
  onOpen: () => void;
  onClose: () => void;
  opened?: boolean;
  content?: JSX.Element | JSX.Element[];
  mobile: boolean;
}

export const Logo = () => (
  <div className={styles.AppHeaderLogo}>
    <img src={"svg/logo.svg"} alt="Logo" className="Logo" />
  </div>
);

const Menu: React.FC<MenuProps> = ({
  onClose = () => null,
  onOpen = () => null,
  opened,
  mobile,
}) => {
  return (
    <>
      <div
        className={clsx(styles.MainMenu, styles.MenuMobile, {
          [styles.MenuMobileShow]: mobile,
        })}
      >
        <PopUpMenu
          mobile={mobile}
          activator={
            <div className={styles.MenuButton}>
              <Icon name="burger" className={styles.MenuIcon} />
            </div>
          }
          mobileHeader={
            <MobileHeader mobile onClose={onClose}>
              <Logo />
            </MobileHeader>
          }
          content={
            <div className={styles.MenuContent}>
              <MenuLeft />
            </div>
          }
          open={opened}
          onClose={onClose}
          onOpen={onOpen}
        />
      </div>
      <div
        className={clsx(styles.MainMenu, styles.MenuDesktop, {
          [styles.MenuDesktopHide]: mobile,
        })}
      >
        <MenuLeft main />
      </div>
    </>
  );
};

const Layout = ({ main }: LayoutProps) => {
  const [open, setOpen] = useState(false);

  const currentAction = useSelector(getCurrentAction);
  const breakpoint = useSelector(getBreakPoint);
  const isTouchDevice = isMobile || isTablet;

  const showMobileHeader = ["xs", "md"].includes(breakpoint);

  const dispatch = useDispatch();

  const code = currentAction?.options?.code;

  const openMenu = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const resizeHandler = useCallback(() => {
    dispatch(setBreakPoint());
  }, []);

  const historyHandler = useCallback((e) => {
    if (e.state) dispatch(requestContentData(e.state));
  }, []);

  useEffect(() => {
    closeMenu();
  }, [code]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("popstate", historyHandler);
    // window.addEventListener("hashchange", historyHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("popstate", historyHandler);
      // window.removeEventListener("hashchange", historyHandler);
    };
  }, []);

  return (
    <>
      <div className={[styles.AppLayout].join(" ")}>
        <div
          className={clsx(
            styles.AppHeaderWrapper,
            styles[`AppHeaderWrapper-${breakpoint}`],
            { [styles.AppHeaderWrapperMobile]: showMobileHeader },
            {
              [styles.Hidden]: currentAction?.entity === "sel_grid",
            }
          )}
        >
          <PanelWrapper
            mobile={showMobileHeader}
            logo={<Logo />}
            themeToggler={<ThemeSwitch />}
          >
            <Menu
              mobile={showMobileHeader}
              onClose={closeMenu}
              onOpen={openMenu}
              opened={open}
            />
          </PanelWrapper>
        </div>
        <div className={[styles.AppBody, styles.PageWrapper].join(" ")}>
          <div style={{ position: "absolute", display: "none" }}>
            isMobile: {isMobile}, isTablet: {isTablet}, bp: {breakpoint}
          </div>
          <div className={styles.AppContent}>{main}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
