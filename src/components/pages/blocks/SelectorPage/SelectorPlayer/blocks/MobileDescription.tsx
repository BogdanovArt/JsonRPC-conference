import clsx from "clsx";
import { Expandable } from "components/common/UI/Expandable";
import { useState } from "react";
import { SelectorExtended } from "../../types";

import styles from "../SelectorPlayer.module.scss";

interface Props {
  selector: SelectorExtended;
  mobile?: boolean;
  expanded?: boolean;
}

export const MobileDescription: React.FC<Props> = ({ selector, mobile, expanded }) => {

  const renderWrapper = (content: JSX.Element) => {
    return mobile ? (
      <Expandable state={expanded} min={19}>
        <div className={styles.SelectorWrapperGrid}>
          <div className={styles.SelectorWrapperContent}>{content}</div>
        </div>
      </Expandable>
    ) : (
      content
    );
  };

  return (
    <div
      className={clsx(styles.SelectorWrapper, {
        [styles.SelectorWrapperExpanded]: expanded,
      })}
    >
      {renderWrapper(
        <>
          {!expanded && mobile ? (
            <div className={styles.SelectorTitleFake}>
              {selector?.displayname}
            </div>
          ) : null}
          <div className={styles.SelectorTitle}>{selector?.displayname}</div>
          {selector?.comment ? (
            <>
              <div className={styles.SelectorDescription}>
                {mobile ? <div>Описание</div> : null}
                {selector.comment}
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};
