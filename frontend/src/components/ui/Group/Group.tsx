import { classes } from "@/utils/classes";

import styles from "./Group.module.css";

type Props = {
  title?: string;
  horizontal?: boolean;
  children?: React.ReactNode;
};

export const Group = ({ title, children, horizontal }: Props) => {
  return (
    <div className={styles.Group}>
      {!!title && <span className={styles.Title}>{title}</span>}
      <div className={classes(styles.Content, horizontal && styles.Horizontal)}>
        {children}
      </div>
    </div>
  );
};
