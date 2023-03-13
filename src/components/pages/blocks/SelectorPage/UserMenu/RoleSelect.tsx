import { Icon } from "@oktell/icons";
import clsx from "clsx";

import { IBasicObject } from "types/index";

import { roles } from "../consts";
import { ActionHandler, CallUser, Topology } from "../types";

import styles from "./UserMenu.module.scss";

interface Props {
  user: CallUser;
  actionHandler?: ActionHandler;
}

export const RoleSelect: React.FC<Props> = ({ actionHandler = () => null, user }) => {
  return (
    <>
      {Object.entries(roles).map(([key, role]: [Topology, IBasicObject]) => (
        <div
          key={key}
          className={styles.MenuItem}
          onClick={() =>
            actionHandler("topology_type", {
              id: user.id,
              type: key,
            })
          }
        >
          <div>
            {key === user.topology_type ? (
              <Icon
                name="check"
                className={clsx(styles.IconSuccess, styles.Icon)}
              />
            ) : null}
          </div>
          <div>{role.title}</div>
        </div>
      ))}
    </>
  );
};
