import { Icon } from "@oktell/icons";
import { Input } from "@oktell/inputs";
import clsx from "clsx";
import { useMemo, useState } from "react";

import { Expandable } from "components/common/UI/Expandable";

import { Participant } from "../../SelectorPage/types";
import { Department } from "../Lists";
import { Groups } from "./Groups";

import styles from "./MobileToolbar.module.scss";

interface Props {
  departments: Department[];
  active: string;
  users: Participant[];
  selected: Participant[];
  search?: string;
  setDepartment?: (department: string) => void;
  setSearch?: (query: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  departments,
  active,
  users,
  search,
  selected,
  setDepartment = () => null,
  setSearch = () => null,
}) => {
  const [showDepartments, setShowDepartments] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleDepartments = (state?: boolean) => {
    setShowSearch(false);
    setShowDepartments(state || !showDepartments);
  };

  const toggleSearch = (state?: boolean) => {
    setShowDepartments(false);
    setShowSearch(state || !showSearch);
  };

  const handleSelect = (department: string) => {
    setShowDepartments(false);
    setDepartment(department);
  };

  return (
    <div className={styles.Toolbar}>
      <div className={styles.ToolbarControls}>
        <div className={styles.ToolbarTitle}>
          {selected?.length ? `Выбрано: ${selected.length}` : `Контакты`}
        </div>
        <div
          className={clsx(styles.ToolbarButton, {
            [styles.ToolbarButtonActive]: showDepartments,
          })}
          onClick={() => toggleDepartments()}
        >
          <Icon name="filter" className={styles.Icon} />
        </div>
        <div
          className={clsx(styles.ToolbarButton, {
            [styles.ToolbarButtonActive]: showSearch,
          })}
          onClick={() => toggleSearch()}
        >
          <Icon name="search" className={styles.Icon} />
        </div>
      </div>

      <Expandable state={showDepartments}>
        <Groups items={departments} active={active} action={handleSelect} />
      </Expandable>

      <Expandable state={showSearch}>
        <div className={styles.ToolbarSearch}>
          <Input
            initial={search}
            placeholder="Поиск"
            after={
              search ? (
                <Icon
                  name="clear"
                  className={clsx(styles.Icon, styles.IconInput)}
                  onClick={() => setSearch("")}
                />
              ) : (
                <Icon
                  name="search"
                  className={clsx(styles.Icon, styles.IconInput)}
                />
              )
            }
            onChange={(name, value) => setSearch(value)}
          />
        </div>
      </Expandable>
    </div>
  );
};
