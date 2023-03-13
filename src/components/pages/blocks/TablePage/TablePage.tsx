import { useState } from "react";
import { useDispatch } from "react-redux";

import { DataTable } from "../DataTable/DataTable";

import { TableHeaders } from "../DataTable/types";

import { IBasicObject, TableEntities } from "types/index";
import { ActionTypes, RequestCodes } from "types/enums";
import { GenericAction, ModalData } from "store/content/types";

import { requestContentData } from "store/content/actions";
import { setModal } from "store/content";

import styles from "./TablePage.module.scss";

interface TablePageProps {
  headers: TableHeaders;
  content: IBasicObject[];
  emptyMessage?: string;
  controls?: boolean;
  editable?: boolean;
  actions: TableEntities;
  entityId?: string;
}

export const TablePage = ({
  headers,
  content,
  controls,
  editable,
  actions,
  emptyMessage = "Отсутствуют данные в системе. Создайте объект.",
  entityId,
}: TablePageProps) => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState({});

  const modifiedHeaders = controls ? [{ key: "select" }, ...headers] : headers;

  const selectedLength = Object.keys(selected).length;

  const selectHandler = (payload: IBasicObject) => {
    setSelected(payload);
  };

  const preparePayload = () => {
    return Object.keys(selected).map((id) => ({ id }));
  };

  const actionsHandler = (
    action: string,
    payload?: IBasicObject | IBasicObject[] | string
  ) => {
    const Action = actions[action];

    if (Action) {
      if (Action.data) {
        dispatch(setModal(Action.data));
        return;
      }

      let pl: GenericAction = {
        action: Action?.action || ActionTypes.get,
        entity: Action?.entity,
      };

      if (Action?.payloadKey && payload) {
        pl.options = { [Action.payloadKey]: payload };
      } else if (Action?.payloadMap && payload) {
        pl.options = {};
        const map = Action?.payloadMap;
        Object.keys(map).forEach((key: string) => {
          pl.options[key] = (payload as IBasicObject)[map[key]];
        });
      }

      if (action === ActionTypes.delete) {
        setSelected([]);
      }

      if (editable) dispatch(requestContentData(pl));
    }
  };

  return (
    <>
      <div className={styles.PageHeader}>
        {controls && [
          selectedLength ? (
            <div
              key="delete"
              className={styles.PageButton}
              onClick={() =>
                selectedLength
                  ? actionsHandler("delete", preparePayload())
                  : null
              }
            >
              <img src="svg/trash.svg" />
              Удалить выбранные ({selectedLength})
            </div>
          ) : null,
          <div
            key="create"
            className={styles.PageButton}
            onClick={() => actionsHandler("create", "none")}
          >
            Создать
          </div>,
        ]}
      </div>
      {content && content.length ? (
        <DataTable
          entityId={entityId}
          content={content}
          headers={modifiedHeaders}
          showHeaders
          selectedIds={selected}
          setSelectedIds={selectHandler}
          controlsAction={actionsHandler}
        />
      ) : (
        <div className={styles.Empty}>
          <img src="svg/Pupa.svg" />
          {emptyMessage}
        </div>
      )}
    </>
  );
};
