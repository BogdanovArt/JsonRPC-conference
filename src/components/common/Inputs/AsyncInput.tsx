import { useEffect, useState } from "react";

import { IBasicObject } from "types/index";

import { Input } from "./Input";

import { ActionTypes, ButtonEntities } from "types/enums";
import { defaultParticipant } from "utils/consts";
import { setError } from "store/content";

import styles from "./AsyncInput.module.scss";
import { useDispatch } from "react-redux";
import { AsyncInputProps } from "./types";

export const AsyncInput = ({
  name,
  placeholder,
  initial,
  disabled,
  visibleKeys = ["name"],
  request = () => null,
  onChange = () => null,
}: AsyncInputProps) => {
  const initialValue = initial && initial.length ? initial : [];

  const dispatch = useDispatch();
  const [selected, setSelected] = useState(initialValue);
  const [value, setValue] = useState("");

  const inputHandler = (name: string, value: string) => {
    setValue(value);
    // async search placeholder
  };

  async function addEntity() {
    const participant = { ...defaultParticipant };
    participant.name = participant.number = value;
    const res = await request({
      entity: ButtonEntities.TEMPLATE_ADD_PARTICIPANT,
      action: ActionTypes.add,
      options: {
        participant,
      },
    });

    handleResponse(res?.data);
  }

  function handleResponse(data: IBasicObject = {}) {
    if (data.success && data.data) {
      onChange(name, data.data as IBasicObject[]);
      setValue("");
    } else if (data.error) {
      dispatch(setError(data.error as string));
    }
  }

  async function removeEntity(id: number) {
    const participant = { id };
    const res = await request({
      entity: ButtonEntities.TEMPLATE_REMOVE_PARTICIPANT,
      action: ActionTypes.delete,
      options: {
        participant,
      },
    });
    handleResponse(res.data);
  }

  useEffect(() => {
    onChange(name, selected);
  }, [selected]);

  useEffect(() => {
    if (JSON.stringify(initial) !== JSON.stringify(selected)) {
      setSelected(initialValue);
    }
  }, [initial]);

  return (
    <div className={styles.Wrapper}>
      <Input
        name={name}
        initial={value}
        placeholder={placeholder}
        onChange={inputHandler}
        onEnter={addEntity}
        disabled={disabled}
        centered
        before={
          <div className={styles.Icon}>
            <img src="svg/search.svg" />
          </div>
        }
      />
      <div className={[styles.List, disabled && styles.Readonly].join(" ")}>
        {selected.map((item, index) => (
          <div key={item.name as string} className={styles.ListItem}>
            <img src="svg/user_filled.svg" alt="user-icon" />
            {visibleKeys.map((key) => (
              <div key={key}>{item[key]}</div>
            ))}
            <div
              className={styles.Button}
              title="Удалить"
              onClick={() => removeEntity(item.id as number)}
            >
              <img src="svg/trash.svg" alt="remove-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
