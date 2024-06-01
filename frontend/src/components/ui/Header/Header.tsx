import styles from "./Header.module.css";

type Props = {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
};

export const Header = ({ children, title, action }: Props) => {
  return (
    <div className={styles.Header}>
      <h1 className={styles.Title}>{title}</h1>
      {action}
    </div>
  );
};
