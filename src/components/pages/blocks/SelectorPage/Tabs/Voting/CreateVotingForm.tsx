import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Icon } from "@oktell/icons";
import clsx from "clsx";

import { Input } from "components/common/Inputs/Input";
import { AddButton } from "../Participants/AddButton";

import { IBasicObject } from "types/index";
import { copy as clone } from "utils/copy";

import styles from "./CreateVotingForm.module.scss";

interface Props {
  form: IBasicObject;
  options: Field[];
  returnForm?: (form: IBasicObject) => void;
  returnOptions?: (fields: Field[]) => void;
}

interface Field {
  id: string;
}

export const CreateVotingForm = ({
  form,
  options,
  returnForm = () => null,
  returnOptions = () => null,
}: Props) => {

  const inputHandler = (name: string, value?: unknown) => {
    const formCopy = clone(form);
    formCopy[name] = value as string;
    returnForm(formCopy);
  };

  const removeOption = (id: string) => {
    const copy = clone(options);
    const index = copy.findIndex((field: Field) => field.id === id);
    copy.splice(index, 1);
    const formCopy = clone(form);
    delete formCopy[id];
    returnForm(formCopy);
    returnOptions(copy);
  };

  const clearOption = (id: string) => {
    const copy = clone(options);
    const formCopy = clone(form);
    formCopy[id] = "";
    returnForm(formCopy);
    returnOptions(copy);
  };

  const addOption = () => {
    const newID = `${Date.now()}`;
    const copy = clone(options);
    copy.push({ id: newID.toString() });
    returnOptions(copy);
  };

  const renderFields = (inputs: Field[]) => {
    return inputs.map((input, index) => (
      <div key={input.id} className={styles.InputRow}>
        <div className={styles.IndexBox}>{index + 1}</div>
        <Input
          initial={form[input.id] as string}
          name={input.id}
          placeholder={`Ответ ${index + 1}`}
          after={
            <div className={styles.InputClear}>
              <Icon
                name="clear"
                className={clsx(styles.Icon, styles.Button, "clear-icon")}
                onClick={() => clearOption(input.id)}
              />
            </div>
          }
          onChange={inputHandler}
        />
        <Icon
          name="trashbin"
          className={clsx(styles.Icon, styles.Button, "remove-icon")}
          onClick={() => removeOption(input.id)}
        />
      </div>
    ));
  };

  useEffect(() => {}, [form]);

  return (
    <div className={clsx(styles.Wrapper, "CreateVotingForm")}>
      <Input
        name="displayname"
        placeholder="Текст вопроса"
        label="Вопрос"
        initial={form.displayname as string}
        onChange={inputHandler}
      />
      <div className="divider" />
      <div className={styles.Options}>
        <span> Ответы</span>
        {renderFields(options)}
        <span></span>
        <div title="Добавить вариант ответа" className={styles.InputRow}>
          <AddButton
            size={25}
            onClick={addOption}
            style={{ justifySelf: "center" }}
          />
        </div>
      </div>
    </div>
  );
};
