import styles from "./MenuIcon.module.scss";

export function MenuIcon({
  icon = null,
  name = "",
  active = false,
}: {
  icon: string | null;
  name: string;
  active: boolean;
}) {
  if (icon) {
    const src = `icons/${icon}`;
    return (
      <div className={styles.IconWrapper}>
        <img
          src={src}
          alt={name}
          className={[
            styles.MenuIcon,
            active ? styles.MenuIconActive : "",
          ].join(" ")}
        />

      </div>
    );
  }
  return null;
}
