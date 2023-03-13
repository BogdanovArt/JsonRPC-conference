import { MenuItemSchema } from "store/menu/types";

import { MenuIcon } from "./MenuIcon/MenuIcon";

import styles from "./MenuItem.module.scss";

interface Props {
  item: MenuItemSchema;
  action: (item: MenuItemSchema) => void;
  active: MenuItemSchema | null;
}
export function MenuItem({ item, action, active }: Props) {
  const itemActive = active && active.code === item.code;
  const groupActive = active && active.parent === item.code;
  const expanded = active && item.parent && active.parent === item.parent;
  const clickable = item.clickable || !active || (active && active.parent !== item.code);

  return (
    <div
      className={[
        styles.MenuItem,
        clickable && styles.MenuItemClickable,
        itemActive && styles.MenuItemActiveItem,
        groupActive && styles.MenuItemActiveGroup,
        expanded && styles.MenuItemExpanded,
        item.parent && styles.MenuItemExpandable,
      ].join(" ")}
      onClick={() => action(item)}
    >
      <div className={styles.MenuItemIcon}>
        <MenuIcon icon={item.icon} name={item.name} active={!!(itemActive || groupActive)} />
      </div>
      <div className={styles.MenuItemTitle}>{item.name}</div>
    </div>
  );
}
