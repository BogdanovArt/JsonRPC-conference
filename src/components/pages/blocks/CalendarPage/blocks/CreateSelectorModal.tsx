import { useMemo } from "react";
import clsx from "clsx";

import { CreateSelectorForm } from "../../SelectorModal/CreateSelector";

import { SelectorForm } from "store/content/types";
import { ModalContexts } from "store/content/enums";
import { Selector } from "../../SelectorPage/types";

import styles from "./CreateSelectorModal.module.scss";

interface Props {
  initial?: SelectorForm;
  onClose?: () => void;
  onSave?: (selector: SelectorForm & Selector) => void;
  className?: string;
}

export const CreateSelectorModal: React.FC<Props> = ({
  initial,
  className,
  onClose = () => null,
  onSave = () => null,
}) => {

  const title = useMemo(() => {
    if (initial?.context === ModalContexts.edit) {
      return "Редактировать селектор";
    }
    return "Новый селектор";
  }, [initial]);

  return (
    <div className={clsx(styles.Modal, className)}>
      <CreateSelectorForm initial={initial} title={title} onClose={onClose} onSave={onSave} />
      <div id="new-selector-footer"></div>
    </div>
  );
};
