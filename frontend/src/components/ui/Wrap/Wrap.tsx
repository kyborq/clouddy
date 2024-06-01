import styles from "./Wrap.module.css";

type Props = {
  children?: React.ReactNode;
};

export const Wrap = ({ children }: Props) => {
  return <div className={styles.Wrap}>{children}</div>;
};
