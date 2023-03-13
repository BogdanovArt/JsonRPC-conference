import clsx from "clsx";
import { TransitionEventHandler, useCallback, useEffect, useRef, useState } from "react";

import styles from "./Expandable.module.scss";

interface Props {
  state: boolean;
  min?: number;
}

export const Expandable: React.FC<Props> = ({ children, state, min = 0 }) => {
  const [container, setContainer] = useState<HTMLDivElement>(null);
  const refTracker = useCallback((node) => setContainer(node), []);

  const getHeight = () => {
    return container?.children[0]?.scrollHeight;
  };

  const expander = () => {
    const height = getHeight();
    if (!container) return;

    container.style.height = `${height}px`;

    if (!state) {
      requestAnimationFrame(() => {
        container.style.height = `${min}px`;
      });
    }
  };

  const animationFinish: TransitionEventHandler = (e) => {
    setHeight();
  };

  const setHeight = () => {
    if (!container) return;
    container.style.height = state ? `auto` : `${min}px`;
  };

  useEffect(() => {
    expander();
  }, [state]);

  useEffect(() => {
    setHeight();
  }, [container]);

  return (
    <div
      ref={refTracker}
      className={clsx(styles.Wrapper, {
        [styles.Expanded]: state,
      })}
      onTransitionEnd={animationFinish}
      style={{ height: min }}
    >
      {children}
    </div>
  );
};
