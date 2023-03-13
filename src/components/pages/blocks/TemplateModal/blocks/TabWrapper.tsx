import styles from "./TabWrapper.module.scss";

export const TabWrapper = ({
  active,
  title,
  children,
}: {
  active: boolean;
  title?: string;
  children?: JSX.Element;
}) => {
  return (
    <div className={[styles.Tab, active && styles.Visible].join(" ")}>
      <div className={styles.TabTitle}>{title}</div>
      {children}
    </div>
  );
};
