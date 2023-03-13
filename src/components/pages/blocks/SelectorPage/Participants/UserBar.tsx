import { useEffect, useRef } from "react";
import clsx from "clsx";
import { Icon } from "@oktell/icons";

import { CallUserCompact } from "./CallUser";

import { ActionHandler, CallUser } from "../types";

import styles from "./UserBar.module.scss";

interface Props {
  users: CallUser[];
  hidden?: boolean;
  actionHandler?: ActionHandler;
}

export const UsersBar: React.FC<Props> = ({ users, hidden, actionHandler }) => {
  const scroll = useRef<HTMLDivElement>(null);

  const slide = (direction: number) => {
    const pageW = scroll.current.clientWidth;
    const scrolled = scroll.current.scrollLeft;

    scroll.current.scrollTo({
      left: scrolled + pageW * direction,
      behavior: "smooth",
    });
  };


  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        slide(-1)
      } else if (event.key === "ArrowRight") {
        slide(1)
      }
    };

    document.addEventListener('keyup', onKeyUp);
  }, []);

  return (
    <div
      hidden={hidden}
      className={clsx(styles.Bar, { [styles.Hidden]: hidden }, "users-bar")}
    >
      <Icon
        name="arrow"
        className="arrow arrow--left"
        onClick={() => slide(-1)}
      />
      <div ref={scroll} className={styles.Scroller}>
        {users.map((user, index) => (
          <CallUserCompact
            key={index}
            user={user}
            actionHandler={actionHandler}
          />
        ))}
      </div>
      <Icon
        name="arrow"
        className="arrow arrow--right"
        onClick={() => slide(1)}
      />
    </div>
  );
};
