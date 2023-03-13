import clsx from "clsx";
import { CallUser } from "../types";

import styles from "./UserStatus.module.scss";
import { useEffect, useState } from "react";

interface Props {
  user: CallUser;
  absolute?: boolean;
}

export const UserStatus: React.FC<Props> = ({ user, absolute }) => {
  const [text, setText] = useState("");
  const hold = user.hold;
  const isHandRaised = user.is_hand_raised;
  const calling = user.state === "calling" || user.state === "retry";

  useEffect(() => {
    if (hold) {
      setText("Отошел");
    } else if (isHandRaised) {
      setText("Хочет сказать");
    } else if (calling) {
      setText("Звоним...");
    } else {
      setText("");
    }
  }, [user]);

  return (
    <div
      className={clsx(styles.Status, {
        [styles.StatusHand]: isHandRaised,
        [styles.StatusCalling]: calling,
        [styles.StatusAbsolute]: absolute,
      })}
    >
      {text}
    </div>
  );
};
