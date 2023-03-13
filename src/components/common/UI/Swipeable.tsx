import clsx from "clsx";
import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./Swipeable.module.scss";

interface Props {
  disabled?: boolean;
  refresh?: unknown;
  before?: JSX.Element | JSX.Element[];
  after?: JSX.Element | JSX.Element[];
  maxRight?: number;
  maxLeft?: number;
  threshold?: number;
  maxOffset?: number;
  swipeAway?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongTouch?: () => void;
  onTouch?: () => void;
  className?: string;
}

export const Swipeable: React.FC<Props> = ({
  disabled,
  refresh,
  children,
  before,
  after,
  threshold = 10,
  maxOffset = 50,
  swipeAway,
  onSwipeLeft,
  onSwipeRight,
  onLongTouch = () => null,
  onTouch = () => null,
  className,
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  const maxLeft = afterRef?.current?.clientWidth || 0;
  const maxRight = beforeRef?.current?.clientWidth || 0;

  const [transition, setTransition] = useState(false);
  const [xStart, setXStart] = useState(0);
  const [xDelta, setXDelta] = useState(0);
  const [xOffset, setXOffset] = useState(0);

  const [timer, setTimer] = useState<NodeJS.Timer>(null);

  const resetPosition = () => {
    setXStart(0);
    setXDelta(0);
    setXOffset(0);
    setTransition(false);
  };

  const setLongTouchTimer = () => {
    setTimer(
      setTimeout(() => {
        onLongTouch();
      }, 500)
    );
  };

  const contentLongClickHandler = () => {
    setLongTouchTimer();
  };

  const mouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    setTransition(true);
    const startPoint = e.clientX;
    if (xOffset) setXDelta(xOffset);
    setXStart(startPoint);
  };

  const touchStartHandler: TouchEventHandler<HTMLDivElement> = (e) => {
    setTransition(true);
    const startPoint = e.touches[0].clientX;
    if (xOffset) setXDelta(xOffset);
    setXStart(startPoint);
  };

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (transition && xStart) {
      const shiftX = e.clientX - xStart;
      if (Math.abs(shiftX) < threshold) return;
      moveHandler(shiftX);
    }
  };

  const touchMoveHandler: TouchEventHandler<HTMLDivElement> = (e) => {
    if (transition && xStart) {
      const shift = e.touches[0].clientX - xStart;
      if (Math.abs(shift) < threshold) return;
      moveHandler(shift);
    }
  };

  const moveHandler = (shift: number) => {
    if (disabled) return;
    clearTimeout(timer);
    setTimer(null);
    if (shift > 0) {
      if (shift > maxRight + maxOffset) return;
    } else {
      if (Math.abs(shift) > maxLeft + maxOffset) return;
    }
    setXDelta(xOffset ? shift + xOffset : shift);
  };

  const moveEndHandler = () => {
    clearTimeout(timer);
    setTimer(null);
    if (xDelta > 0) {
      const over = xDelta >= maxRight;
      const swiped = !xOffset && !!maxRight && over;
      setXOffset(over ? maxRight : 0);
      if (swiped && onSwipeRight) {
        swipeAway ? setXOffset(window.innerWidth) : null;
        onSwipeRight();
      }
    } else {
      const over = Math.abs(xDelta) >= maxLeft;
      const swiped = !xOffset && !!maxLeft && over;
      setXOffset(Math.abs(xDelta) >= maxLeft ? -maxLeft : 0);
      if (swiped && onSwipeLeft) {
        swipeAway ? setXOffset(-window.innerWidth) : null;
        onSwipeLeft();
      }
    }
  };

  const mouseUpHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    setTransition(false);
    moveEndHandler();
    setXStart(0);
    setXDelta(0);
  };

  const touchEndHandler: TouchEventHandler<HTMLDivElement> = (e) => {
    setTransition(false);
    moveEndHandler();
    setXStart(0);
    setXDelta(0);
  };

  const getTransition = () => {
    let shift = transition ? xDelta : xOffset;
    return `translateX(${shift}px)`;
  };

  useEffect(() => {
    resetPosition();
  }, [refresh]);

  return (
    <div
      ref={wrapper}
      className={clsx(styles.Wrapper, className)}
      onMouseMove={mouseMoveHandler}
      onTouchMoveCapture={touchMoveHandler}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
    >
      <div
        ref={content}
        style={{ transform: getTransition() }}
        className={clsx(styles.Content, transition ? styles.Moved : "")}
        onTouchStart={contentLongClickHandler}
        onMouseDown={contentLongClickHandler}
        onClick={onTouch}
      >
        {children}
      </div>
      <div className={styles.Underlay}>
        <div ref={beforeRef} className={styles.Before}>
          {before}
        </div>
        <div className={styles.Spacer}></div>
        <div ref={afterRef} className={styles.After}>
          {after}
        </div>
      </div>
    </div>
  );
};
