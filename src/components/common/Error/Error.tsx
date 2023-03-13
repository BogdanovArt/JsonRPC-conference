import styles from "./Error.module.scss";

export function ErrorBlock({ error }: { error: string }) {
  return (
    <div className={styles.ErrorBlock}>
      <div className={styles.ErrorBlockTitle}>Ошибка!</div>
      {error}
    </div>
  );
}
