import { useEffect, useState } from "react";

import { CheckBox } from "components/common/Inputs/CheckBox";
import { EventTypes } from "components/common/Inputs/types";
import { DropDown } from "components/common/Inputs/Select";

import { selectorUserRoles } from "../SelectorPage/consts";
import { getSorter } from "store/menu/utils";
import { getLocalDate } from "utils/dateConverters";

import { SortOrders } from "types/enums";

import { HeaderControlItem, TableHeader, TableProps } from "./types";
import { IBasicObject } from "types/index";

import styles from "./DataTable.module.scss";

export const DataTable = ({
  content,
  headers,
  showHeaders,
  entityId = "",
  selectedIds = {},
  setSelectedIds = () => null,
  controlsAction = () => null,
}: TableProps) => {
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState<SortOrders>(SortOrders.DSC);

  const sorter = getSorter(sort);

  const selectedAmount = Object.keys(selectedIds).length;

  const handleSort = (key: string) => {
    if (key !== sort) {
      setSort(key);
      setOrder(SortOrders.DSC);
      return;
    }

    switch (order) {
      case SortOrders.DSC:
        setOrder(SortOrders.ASC);
        break;
      case SortOrders.ASC:
        setSort("");
        setOrder(SortOrders.DSC);
        break;
      default:
        break;
    }
  };

  const selectAllHandler = (state: boolean, type: EventTypes) => {
    if (type === "manual") {
      if (state) {
        const ids: IBasicObject = {};
        content.forEach((row) => {
          ids[row.id as string] = true;
        });
        setSelectedIds(ids);
      } else {
        setSelectedIds({});
      }
    }
  };

  const selectHandler = (state: boolean, item: IBasicObject) => {
    const copyIds = { ...selectedIds };
    if (state) {
      copyIds[item.id as string] = true;
    } else {
      delete copyIds[item.id as string];
    }
    setSelectedIds(copyIds);
  };

  const renderHeaders = () => {
    if (!showHeaders) return null;
    return (
      <thead className={styles.TableHeaders}>
        <tr>
          {headers.map((header, index) => (
            <td
              key={header.key + index}
              className={[styles.TableHeader, styles[header.key]].join(" ")}
              onClick={() => (header.sort ? handleSort(header.key) : null)}
            >
              {renderHeaderCell(header)}
            </td>
          ))}
        </tr>
      </thead>
    );
  };

  const renderContent = () => {
    const sorted = sort ? [...content].sort(sorter) : content;
    if (sort && order === SortOrders.ASC) {
      sorted.reverse();
    }
    return (
      <tbody>
        {sorted?.map((row, ind) => (
          <tr
            key={ind}
            className={styles.TableRow}
            onDoubleClick={() => controlsAction("dbclick", { id: row.id })}
          >
            {renderRow(row, ind)}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderRow = (row: IBasicObject, rowIndex: number) => {
    return headers.map((header, ind) => (
      <td
        key={ind}
        className={[styles.TableCell, styles[header.key]].join(" ")}
      >
        {renderCell(header, row, rowIndex)}
      </td>
    ));
  };

  const renderHeaderCell = (header: TableHeader) => {
    switch (header.key) {
      case "select":
        return (
          <CheckBox
            initial={selectedAmount === content.length}
            big
            onChange={(name, state, type) =>
              selectAllHandler(state as boolean, type)
            }
          />
        );
      default:
        const active = sort === header.key;
        return (
          <div className={styles.TableHeaderContent}>
            {header.title}
            {header.sort ? (
              <img
                className={[
                  styles.TableHeaderIcon,
                  active && styles.IconActive,
                  active && order === SortOrders.ASC && styles.IconReverse,
                ].join(" ")}
                src="svg/chevron.svg"
              />
            ) : null}
          </div>
        );
    }
  };

  const renderCell = (
    header: TableHeader,
    row: IBasicObject,
    index: number
  ) => {
    try {
      const buttons: JSX.Element[] = [];
      switch (header.key) {
        case "select":
          return (
            <CheckBox
              initial={!!selectedIds[row.id as string]}
              onChange={(name, state) => selectHandler(state as boolean, row)}
            />
          );
        case "topology_type":
          const action = (name: string, type: string) => {
            if (type && type !== row.topology_type) {
              controlsAction("topology_type", {
                id: row.id,
                type,
                entityId,
              });
            }
          };
          return (
            <div style={{ width: 130 }}>
              <DropDown
                name="mode"
                slim
                items={selectorUserRoles}
                initial={row.topology_type as string}
                onChange={action}
              />
            </div>
          );
        case "controls-boolean":
          if (header.items) {
            const ref = Object.keys(header.items);
            ref.forEach((itemKey, index) => {
              const item = row[itemKey]
                ? header.items[itemKey].on
                : header.items[itemKey].off;
              if (item) {
                buttons.push(
                  <div
                    key={index}
                    className={[
                      styles.ControlsButton,
                      !item.action && styles.Unactive,
                    ].join(" ")}
                    onClick={() =>
                      item.action
                        ? controlsAction(item.action, {
                            id: row.id,
                            button: itemKey,
                            entityId,
                          })
                        : null
                    }
                  >
                    <img
                      src={item.icon}
                      alt="icon"
                      className={styles.ControlsIcon}
                    />
                  </div>
                );
              }
            });
          }
          return <div className={styles.Controls}>{buttons}</div>;
        case "state-buttons":
          if (header.items) {
            const ref = Object.keys(header.items);
            ref.forEach((itemKey, index) => {
              const state = row[itemKey] as string | undefined;
              const item =
                (state && header.items[itemKey]?.[state]) ||
                header.items[itemKey]?.default;
              const key = row.id.toString() + "-" + item?.icon;
              const icon = <img key={key} src={item?.icon} alt="icon" />;
              item?.action
                ? buttons.push(
                    <div
                      key={key}
                      className={styles.ControlsButton}
                      onClick={() =>
                        controlsAction(item.action, { id: row.id })
                      }
                    >
                      {icon}
                    </div>
                  )
                : buttons.push(icon);
            });
          }
          if (header.buttons) {
            header.buttons.forEach((button, index) => {
              const key = row.id.toString() + "-" + button?.icon;
              buttons.push(
                <div
                  key={key}
                  className={styles.ControlsButton}
                  onClick={() => controlsAction(button.action, { id: row.id })}
                >
                  <img
                    src={button.icon}
                    alt="icon"
                    className={styles.ControlsIcon}
                  />
                </div>
              );
            });
          }
          return <div className={styles.Controls}>{buttons}</div>;
        case "participants":
          return Array.isArray(row[header.key])
            ? (row[header.key] as IBasicObject[]).length
            : row[header.key];
        case "timestartutc":
          return getLocalDate(row.timestartutc as string, "HH:mm d MMM yyyy");
        default:
          return row[header.key];
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.Container}>
      <table className={styles.Table}>
        {renderHeaders()}
        {renderContent()}
      </table>
    </div>
  );
};
