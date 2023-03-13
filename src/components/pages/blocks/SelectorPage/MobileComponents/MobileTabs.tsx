import { TabButton } from "../Tabs/Panel";
import { Tab } from "../types";

import styles from "./MobileTabs.module.scss";

interface TabProps {
  tabs: Tab[];
  toggle?: (tab: Tab) => void;
  active?: Tab;
}

export const MobileTabs: React.FC<TabProps> = ({ tabs, toggle, active }) => {
  return (
    <div className={styles.TabsPanel}>
      {tabs.map((tab, index) => (
        <TabButton
          tab={tab}
          active={active?.key === tab.key}
          toggle={toggle}
          breakpoint="xl"
        />
      ))}
    </div>
  );
};
