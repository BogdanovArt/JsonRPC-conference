import { AllHTMLAttributes, useState } from "react";
import { Icon } from "@oktell/icons";

import { SearchInputProps } from "./types";

import styles from "./Search.module.scss";
import clsx from "clsx";

export const Search: React.FC<SearchInputProps & { className?: string }> = ({
  onChange,
  className,
}) => {
  const [value, setValue] = useState("");

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setValue(value);
    if (value.length > 1) {
      onChange(name, value.toLowerCase());
    } else {
      onChange(name, "");
    }
  };

  const clearValue = () => {
    setValue("");
    onChange("search", "");
  };

  return (
    <div className={clsx(styles.Wrapper, className)}>
      <input
        className={styles.Input}
        placeholder="Поиск"
        name="search"
        type="text"
        value={value}
        onChange={onChangeHandler}
      />
      {value ? (
        <Icon name="clear" className={styles.Icon} onClick={clearValue} />
      ) : (
        <Icon name="search" className={styles.Icon} />
      )}
    </div>
  );
};
