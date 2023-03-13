import React from "react";
import { Preloader } from "@oktell/preloader";

import styles from "./Loading.module.scss";

interface Props {
  fetching: boolean;
}

export const Loading = ({ fetching }: Props) => {
  return (
    <div
      className={[styles.Loading, fetching && styles.LoadingActive].join(" ")}
    >
      <div className={styles.LoadingOverlay}></div>
      <div className={styles.LoadingSpinner}>
        {fetching ? <Preloader /> : null}
      </div>
    </div>
  );
};
