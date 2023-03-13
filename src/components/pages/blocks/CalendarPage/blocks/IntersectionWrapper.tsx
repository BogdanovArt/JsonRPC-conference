import clsx from "clsx";
import { useRef } from "react";
import { useIntersectionObserver } from "utils/IntersectionObserver";

import styles from "./IntersectionWrapper.module.scss";

interface Props {
  onScrolledDown?: () => void;
  onScrolledUp?: () => void;
  onVisible?: () => void;
}

export const IntersectionObserverWrapper: React.FC<Props> = ({
  children,
  onVisible = () => null,
  onScrolledDown = () => null,
  onScrolledUp = () => null,
}) => {
  const Wrapper = useRef<HTMLDivElement>(null);
  const IntersectionCallback = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry) {
      if (entry.intersectionRatio === 1) {
        // became visible (from up or down);
        onVisible();
      } else {
        if (entry.boundingClientRect.top + 50 < entry.rootBounds?.height) {
          // scrolled up (50 - threshold in px);
          onScrolledUp();
        } else {
          // scrolled down
          onScrolledDown();
        }
      }
    }
  };

  useIntersectionObserver(Wrapper, IntersectionCallback);

  return (
    <div
      ref={Wrapper}
      className={clsx(
        "IntersectionObserverWrapper",
        styles.IntersectionObserverWrapper
      )}
    >
      {children}
    </div>
  );
};
