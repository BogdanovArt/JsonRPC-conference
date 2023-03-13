import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { Icon } from "@oktell/icons";
import Format from "date-fns/format";
import Slide from "@material-ui/core/Slide";
import { Portal } from "@oktell/header-panel";
import { isMobile, isTablet } from "react-device-detect";

import { MobileList } from "./blocks/MobileList";
import { Groups } from "./blocks/Groups";
import { getFilterTitle } from "./blocks/getFilterTitle";
import { ListTable } from "./blocks/ListTable";
import { Toolbar as MobileToolbar } from "./blocks/MobileToolbar";

import { Search } from "components/common/Inputs/Search";
import { Button } from "components/common/UI/Button";
import {
  CallUser,
  Participant,
} from "components/pages/blocks/SelectorPage/types";
import { initialSelectorFormEmpty } from "components/pages/blocks/SelectorModal/consts";
import { FormKeys } from "components/pages/blocks/TemplateModal/enums";
import { CreateSelectorModal } from "components/pages/blocks/CalendarPage/blocks/CreateSelectorModal";
import {
  ModalStyles,
  SlideMobileStyles,
  SlideStyles,
  SlideTabletStyles,
} from "components/pages/blocks/CalendarPage/consts";
import { ScrollContainer } from "components/common/UI/ScrollContainer";

import { IBasicObject } from "types/index";

import { SelectorForm } from "store/content/types";
import { getBreakPoint } from "store/core/getters";

import { copy } from "utils/copy";
import { uniqueArray } from "utils/uniqueArray";

import styles from "./Lists.module.scss";
import commonStyles from "components/layout/Default.module.scss";
import modalStyles from "components/pages/blocks/CalendarPage/blocks/CalendarModal/Slide.module.scss";

interface Props {
  children?: JSX.Element | JSX.Element[];
  content: Participant[];
}

export interface Department {
  key: string;
  title: string;
  users: number;
}

enum PropNames {
  search = "search",
}

export const ListsPage = ({ children, content }: Props) => {
  const [newValue, setNewValue] = useState<IBasicObject>({});
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [newSelector, setNewSelector] = useState<SelectorForm>(null);
  const [newSelectorModal, setNewSelectorModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filterGroup, setFilterGroup] = useState("all");

  const groups = useMemo(() => {
    const names = content?.map
      ? uniqueArray(content.map((item) => item.department))
      : [];
    const departments: Department[] = [
      {
        key: "all",
        title: "Все контакты",
        users: content?.length,
      },
    ];
    names.forEach((name) => {
      const users = content?.filter((user) => user.department === name).length;
      departments.push({ key: name, title: name || "Отдел не указан", users });
    });
    return departments;
  }, [content]);

  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  const isTouchDevice = isMobile || isTablet;

  const pointer: { [key: string]: Dispatch<SetStateAction<string>> } = {
    [PropNames.search]: setFilterName,
  };

  const onChangeValue = (name: string, value?: string) => {
    const formCopy = copy(newValue); // заменил на утилиту копирования для сохранения типа клонируемых данных
    formCopy[name] = value;
    setNewValue(formCopy);
    formHandler(formCopy);
  };

  const formHandler = (form: IBasicObject) => {
    Object.entries(pointer).forEach(([key, setter]) => {
      const value = form[key] || "";
      setter(value as string);
    });
  };

  const rowClickHandler = (users: CallUser[]) => {
    setSelected(users);
  };

  const nameFilter = (name: string) => {
    if (!nameFilter) return true;
    return name.toLowerCase().includes(filterName.toLowerCase());
  };

  const numberFilter = (number: string) => {
    if (!numberFilter) return true;
    return number.includes(filterName.toLowerCase());
  };

  const emailFilter = (email: string) => {
    if (!emailFilter) return true;
    return email.toLowerCase().includes(filterName.toLowerCase());
  };

  const filterTable = (rows?: IBasicObject[]) => {
    return rows?.filter
      ? rows.filter((row) => {
          const name = row.displayname as string;
          const email = row.email as string;
          const number = row.number as string;
          return nameFilter(name) || numberFilter(number) || emailFilter(email);
        })
      : [];
  };

  const filteredGroup = useMemo(() => {
    if (filterGroup === "all") return content;
    return content?.filter((user) => user.department === filterGroup);
  }, [content, filterGroup]);

  const filteredContent = useMemo(() => {
    return filterTable(filteredGroup) as Participant[];
  }, [filteredGroup, newValue]);

  const slideStyles = useMemo(() => {
    switch (true) {
      case isTablet || breakpoint === "lg":
        return SlideTabletStyles;
      case isMobile:
        return SlideMobileStyles;
      default:
        return SlideStyles;
    }
  }, [breakpoint]);

  const createNewSelector = async (date?: Date) => {
    const formatDate = date ? Format(date, "yyyy-MM-dd HH:mm") : "";
    const initialFormData: SelectorForm = {
      ...initialSelectorFormEmpty,
      [FormKeys.timeStartUTC]: formatDate,
      [FormKeys.participants]: selected,
      [FormKeys.templateId]: "3f3807ce-017c-a1b7-5f9a-fa163e25a239",
    };
    setNewSelector(initialFormData);
  };

  const closeNewSelectorModal = () => {
    setNewSelectorModal(false);
  };

  useEffect(() => {
    if (newSelector) {
      setNewSelectorModal(true);
    }
  }, [newSelector]);

  const renderDesktopUI = () => {
    return (
      <>
        <div className={styles.Toolbar}>
          <h1 className={styles.Title}>
            <span className={styles.TitleText}>
              {getFilterTitle(filterGroup)}
            </span>

            <span className={styles.TitleCount}>
              ({filteredContent?.length})
            </span>
          </h1>

          {showSearch ? (
            <Search onChange={onChangeValue} />
          ) : (
            <button
              className={styles.Search}
              onClick={() => setShowSearch(true)}
            >
              <Icon name="search" />
            </button>
          )}
        </div>
        <ListTable
          items={filteredContent}
          selected={selected}
          returnValue={rowClickHandler}
        />
        <div
          className={clsx(styles.SelectedUsers, {
            [styles.SelectedUsersBorder]: filteredContent?.length > 20,
          })}
        >
          <div>Выбрано пользователей: {selected.length}</div>

          <Button
            color="var(--accent-color)"
            onClick={() => createNewSelector()}
          >
            Создать селектор...
          </Button>
        </div>
      </>
    );
  };

  const renderDesktopToolbar = () => {
    return (
      <div className={clsx(styles.Sidebar, styles[`Sidebar-${breakpoint}`])}>
        <ScrollContainer className={styles.ListsSidebar}>
          <Groups items={groups} active={filterGroup} action={setFilterGroup} />
        </ScrollContainer>
      </div>
    );
  };
  const renderMobileToolbar = () => {
    return (
      <MobileToolbar
        departments={groups}
        active={filterGroup}
        users={filteredContent}
        selected={selected}
        search={filterName}
        setDepartment={setFilterGroup}
        setSearch={(value) => onChangeValue("search", value)}
      />
    );
  };

  const renderMobileUI = () => {
    return (
      <>
        <MobileList
          users={filteredContent}
          selected={selected}
          returnValue={setSelected}
        />
        {!isDesktop && selected.length ? (
          <Button
            dark
            onClick={() => createNewSelector()}
            className={styles.CreateButton}
          >
            Создать селектор...
          </Button>
        ) : null}
      </>
    );
  };

  const isModalPorted = ["lg", "md", "xs"].includes(breakpoint) || isTouchDevice;

  const renderModalWrapper = (content: JSX.Element) => {
    return isModalPorted ? (
      <Portal id="header-modal">{content}</Portal>
    ) : (
      content
    );
  };

  return (
    <div className={clsx(commonStyles.Grid, styles[`Grid-${breakpoint}`])}>
      {isDesktop ? renderDesktopToolbar() : renderMobileToolbar()}

      <div className={clsx(styles.Lists, styles[`Lists-${breakpoint}`])}>
        {isDesktop ? renderDesktopUI() : renderMobileUI()}

        {renderModalWrapper(
          <Slide direction="left" in={newSelectorModal} style={slideStyles}>
            <div
              className={clsx(
                styles.Slide,
                modalStyles[`SelectorModal-${breakpoint}`],
                { [modalStyles.SelectorModalMobile]: isTouchDevice }
              )}
            >
              {newSelector ? (
                <CreateSelectorModal
                  initial={newSelector}
                  onClose={closeNewSelectorModal}
                  className="ModalContent"
                />
              ) : null}
            </div>
          </Slide>
        )}
      </div>
    </div>
  );
};
