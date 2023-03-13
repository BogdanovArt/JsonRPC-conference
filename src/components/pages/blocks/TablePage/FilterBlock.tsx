import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Expand } from "components/common/UI/Expand";
import { Button } from "components/common/UI/Button";
import { Input } from "components/common/Inputs/Input";
import { YearMonthPicker as DatePicker } from "components/common/Inputs/DatePicker";

import { requestContentData } from "store/content/actions";

import { ArchivedActions } from "utils/consts";

import styles from "./FilterBlock.module.scss";
import { IBasicObject } from "types/index";

interface Props {
  returnValue?: (payload: IBasicObject) => void;
}

export const FilterBlock = ({ returnValue = () => null }: Props) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState<IBasicObject>({});

  const inputHandler = (name: string, value?: any) => {
    const formCopy = JSON.parse(JSON.stringify(form));
    formCopy[name] = value;
    setForm(formCopy);
  };

  const submit = () => {
    const { entity, action, payloadKey } = ArchivedActions.search;
    const searchAction = { entity, action, options: { [payloadKey]: form } };

    // dispatch(requestContentData(searchAction));
    returnValue(form);
  };

  const reset = () => {
    setForm({});
    returnValue({});
  };

  return (
    <div className={styles.Wrapper} style={{ marginBottom: -25 }}>
      <Expand title="Панель поиска">
        <div className={styles.Form}>
          <div className={[styles.FormBlock, styles.FormBlockColumn].join(" ")}>
            <Input
              name="displayname"
              placeholder="Введите название"
              initial={form.displayname as string}
              onChange={inputHandler}
            />
            <Input
              name="name_number"
              placeholder="Имя или номер участника"
              initial={form.name_number as string}
              onChange={inputHandler}
            />
          </div>
          <div className={[styles.FormBlock, styles.FormBlockColumn].join(" ")}>
            <div className={[styles.FormBlock, styles.FormBlockRow].join(" ")}>
              <div>От</div>
              <DatePicker
                name="timestartutc_start"
                initial={form.timestartutc_start as string}
                onChange={inputHandler}
              />
              <div>До </div>
              <DatePicker
                name="timestartutc_finish"
                initial={form.timestartutc_finish as string}
                onChange={inputHandler}
              />
            </div>
            <div className={styles.Controls}>
              <Button onClick={reset}>
                <span>Очистить фильтры</span>
              </Button>
              <Button dark onClick={submit}>
                <span style={{ padding: "0 40px" }}>Найти</span>
              </Button>
            </div>
          </div>
        </div>
      </Expand>
    </div>
  );
};
