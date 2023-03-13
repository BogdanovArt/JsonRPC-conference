import React, { Dispatch, SetStateAction, useState } from "react";

import { FilterBlock } from "components/pages/blocks/TablePage/FilterBlock";

import { IBasicObject } from "types/index";

import styles from "./Archived.module.scss";

interface Props {
  children?: JSX.Element | JSX.Element[];
}

enum PropNames {
  name = "displayname",
  user = "name_number",
  start = "timestartutc_start",
  end = "timestartutc_finish",
}

export const ArchivedPage = ({ children }: Props) => {
  const [filterUser, setFilterUser] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const pointer: { [key: string]: Dispatch<SetStateAction<string>> } = {
    [PropNames.name]: setFilterName,
    [PropNames.user]: setFilterUser,
    [PropNames.end]: setFilterEnd,
    [PropNames.start]: setFilterStart,
  };

  const formHandler = (form: IBasicObject) => {
    Object.entries(pointer).forEach((pair) => {
      const key = pair[0] as string;
      const setter = pair[1];
      const value = form[key] || "";
      setter(value as string);
    });
  };

  const filterTable = (rows?: IBasicObject[]) => {
    return rows?.filter((row) => {
      const users = Array.isArray(row.participants)
        ? (row.participants as IBasicObject[])
        : [];
      const name = row.displayname as string;
      const date = row.timestartutc as string;
      return (
        userFilter(users) &&
        nameFilter(name) &&
        startFilter(date) &&
        endFilter(date)
      );
    });
  };

  const userFilter = (users: IBasicObject[]) => {
    if (!filterUser) return true;
    const match = users.find((user) => {
      const name = user.name as string;
      const number = user.number as string;
      return name.includes(filterUser) || number.includes(filterUser);
    });
    return !!match;
  };

  const nameFilter = (name: string) => {
    if (!nameFilter) return true;
    return name.includes(filterName);
  };

  const startFilter = (start: string) => {
    if (!start || !filterStart) return true;
    const date = start.split(" ")[0];
    return filterStart < date;
  };

  const endFilter = (end: string) => {
    if (!end || !filterEnd) return true;
    const date = end.split(" ")[0];
    return filterEnd > date;
  };

  const renderTable = () => {
    const table = children as any;
    const filtered = filterTable(table.props.content);
    const copyFiltered = filtered ? JSON.parse(JSON.stringify(filtered)) : [];
    const content = copyFiltered?.map((entity: any) => {
      const users = entity.participants as IBasicObject[];
      if (Array.isArray(users)) {
        entity.participants = users.length;
        return entity;
      }
      return entity;
    });
    return React.cloneElement(children as any, { content });
  };

  return (
    <div className={styles.Page}>
      <FilterBlock key="filter" returnValue={formHandler} />
      {renderTable()}
    </div>
  );
};
