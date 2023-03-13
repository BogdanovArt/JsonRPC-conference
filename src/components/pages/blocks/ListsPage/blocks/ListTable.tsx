import { useMemo, useState } from "react";
import { Avatar } from "@oktell/header-panel";

import clsx from "clsx";

import { CheckBox } from "components/common/Inputs/CheckBox";
import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { PaginationCustom as Pagination } from "components/common/UI/Pagination";

import { IBasicObject } from "types/index";
import { copy } from "utils/copy";

import styles from "./ListTable.module.scss";

interface Props {
  items: Item[];
  selected: Item[];
  returnValue?: (item: Item[]) => void;
}

interface Item extends IBasicObject {}

export const ListTable: React.FC<Props> = ({
  items,
  selected,
  returnValue = () => null,
}) => {
  const [pages, setPages] = useState({ start: 0, end: 20 });

  const allSelected = items.length === selected.length;

  const allSelectHandler = () => {
    returnValue(allSelected ? [] : items);
  };

  const itemClickHandler = (item: Item) => {
    const match = selected.findIndex((s) => s.number === item.number);

    if (match > -1) {
      const clone = copy(selected);
      clone.splice(match, 1);
      returnValue(clone);
    } else {
      returnValue([...selected, { ...item, name: item.displayname }]);
    }
  };

  const changePages = (start: number, end: number) => {
    setPages({ start, end });
  };

  const paginatedItems = useMemo(
    () => items?.slice(pages.start, pages.end),
    [pages, items]
  );

  return (
    <>
      <table className={styles.Table}>
        <div className={styles.TableCellHead}>
          <div className={styles.TableRow}>
            <div className={clsx(styles.TableCell, styles.TableCellBig)}>
              <div
                className={styles.NameCell}
                onClick={() => allSelectHandler()}
              >
                <CheckBox big initial={allSelected} />
                <div className={styles.NameCellText}>Имя</div>
              </div>
            </div>
            <div className={clsx(styles.TableCell, styles.TableCellSmall)}>
              Номер / аккаунт
            </div>
            <div className={clsx(styles.TableCell, styles.TableCellBig)}>
              Email
            </div>
          </div>
        </div>
        <ScrollContainer
          className={clsx(styles.ListsTable, {
            [styles.ListsTablePagination]: items?.length > 20,
          })}
        >
          <div className={styles.TableCellBody}>
            {paginatedItems?.map((item: any) => (
              <div
                key={item.id}
                className={clsx(styles.TableRow, {
                  [styles.TableRowSelected]: selected.some(
                    (selected) => selected.number === item.number
                  ),
                })}
                onClick={() => itemClickHandler(item)}
              >
                <div className={clsx(styles.TableCell, styles.TableCellBig)}>
                  <div className={styles.NameCell}>
                    <CheckBox
                      big
                      initial={selected.some(
                        (selected) => selected.number === item.number
                      )}
                    />
                    <div className={styles.NameCellText}>
                      <Avatar name={item.displayname} size={24} />
                      <span>{item.displayname}</span>
                    </div>
                  </div>
                </div>
                <div className={clsx(styles.TableCell, styles.TableCellSmall)}>
                  {item.number}
                </div>
                <div className={clsx(styles.TableCell, styles.TableCellBig)}>
                  {item.email}
                </div>
              </div>
            ))}
          </div>
        </ScrollContainer>
      </table>
      {items?.length > 20 ? (
        <Pagination itemsCount={items?.length} onChange={changePages} />
      ) : null}
    </>
  );
};
