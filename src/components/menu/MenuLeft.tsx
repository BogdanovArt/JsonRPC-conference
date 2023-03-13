import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { MenuItem } from "./blocks/MenuItem/MenuItem";

import { getActiveItem, getMenu } from "store/menu/getters";
import { requestMenuData } from "store/menu/actions";
import { setActiveItem } from "store/menu";
import { MenuItemSchema } from "store/menu/types";
import { requestContentData } from "store/content/actions";
import { getCurrentAction } from "store/content/getters";

import { CoreEntities, RequestCodes } from "types/enums";
import { ArchivedActions, CurrentActions } from "utils/consts";

import styles from "./MenuLeft.module.scss";

let initialized = false;
let gotContent = false;

interface MenuProps {
  main?: boolean;
}

export function MenuLeft({ main }: MenuProps) {
  const menu = useSelector(getMenu);
  const action = useSelector(getCurrentAction);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!gotContent) {
      dispatch(requestMenuData());
      gotContent = true;
    }
  }, []);

  const active: MenuItemSchema = menu.find(
    (item) => item.code === action?.options?.code
  );

  const dispatchItemAction = async (item: MenuItemSchema) => {
    const code = item.code as RequestCodes;
    await dispatch(requestContentData({ options: { code } }));
    dispatch(setActiveItem({ ...item, entity: CoreEntities.content }));
  };

  const MenuItemAction = async (item: MenuItemSchema) => {
    if (item.code === active?.parent || item.code === active?.code) return;
    if (item.clickable) {
      dispatchItemAction(item);
    } else {
      const index = menu.findIndex((el) => el.code === item.code);
      if (index > -1 && menu[index + 1]) {
        dispatchItemAction(menu[index + 1]);
      }
    }
  };

  const tempAction = async () => {
    const action = ArchivedActions.dbclick;
    const pl = {
      entity: action.entity,
      options: {
        [action.payloadKey]: {
          id: "079bc945-017f-a90f-2cbf-fa163e25a239",
        },
      },
    };

    await dispatch(requestContentData(pl));
  };

  useEffect(() => {
    if (menu.length && main && !initialized) {
      const code = location.hash.replace("#", "");
      const match = menu.find((item) => item.code === code);

      if (match) {
        MenuItemAction(match);
      } else {
        MenuItemAction(menu[0]);
      }
      
      // tempAction();
      initialized = true;

    }
  }, [menu]);

  const renderItems = menu.map((item, ind) => (
    <MenuItem key={ind} item={item} action={MenuItemAction} active={active} />
  ));

  return (
    <>
      <div className={styles.MenuLeft}>{renderItems}</div>
    </>
  );
}
