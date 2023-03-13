import { Avatar } from "@oktell/header-panel";
import { Icon } from "@oktell/icons";
import { Swipeable } from "components/common/UI/Swipeable";

import { Participant } from "../../SelectorPage/types";

import styles from "./ListItem.module.scss";

interface Props {
  user: Participant;
  selected?: boolean;
  onHoldAction?: () => void;
  onClickAction?: () => void;
  onRemoveAction?: () => void;
}

export const ListItem: React.FC<Props> = ({
  user,
  selected,
  onClickAction = () => null,
  onRemoveAction = () => null,
  onHoldAction = () => null,
}) => {
  const testSwipe = (direction: number) => {
    // console.log("swiped", direction);
  };

  return (
    <div className={styles.Wrapper} data-search-marker={user?.displayname?.[0]}>
      <Swipeable
        after={
          <div className={styles.Remove}>
            <Icon name="trashbin" className={styles.Icon} />
          </div>
        }
        onTouch={onClickAction}
        onLongTouch={onHoldAction}
        onSwipeLeft={() => testSwipe(-1)}
        onSwipeRight={() => testSwipe(1)}
      >
        <div className={styles.User}>
          <div className={styles.Avatar}>
            {selected ? (
              <div className={styles.Selected}>
                <Icon name="check" className={styles.Icon} />
              </div>
            ) : (
              <Avatar size={24} name={user?.displayname} />
            )}
          </div>
          <div>{user?.displayname}</div>
          <div></div>
          <div className={styles.Number}>{user?.number}</div>
        </div>
      </Swipeable>
    </div>
  );
};
