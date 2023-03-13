import { useDispatch, useSelector } from "react-redux";

import {
  getContentData,
  getCurrentAction,
  getError,
  getFetching,
  getModal,
} from "store/content/getters";
import { setError } from "store/content";

import { Portal } from "components/common/Modal/Portal";
import { Modal } from "components/common/Modal/Modal";
import { Loading } from "components/common/UI/Loading/Loading";

import { PageDispatcher } from "./blocks/PageDispatcher";

import styles from "./ContentPage.module.scss";

export function ContentPage() {
  const error = useSelector(getError);
  const content = useSelector(getContentData);
  const modalData = useSelector(getModal);
  const active = useSelector(getCurrentAction);
  const fetching = useSelector(getFetching);

  const dispatch = useDispatch();

  return (
    <div className={styles.ContentPage}>
      <Portal component={<Loading fetching={fetching} />} />
      <Portal
        component={
          <Modal
            show={!!error}
            title="Ошибка!"
            content={<div>{error}</div>}
            onClose={() => dispatch(setError(null))}
            contentClassName={styles.ErrorModal}
          />
        }
      />
      <PageDispatcher active={active} content={content} modal={modalData} />
    </div>
  );
}
